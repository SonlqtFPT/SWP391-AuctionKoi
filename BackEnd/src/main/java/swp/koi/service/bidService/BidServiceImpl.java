package swp.koi.service.bidService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.AutoBidRequestDTO;
import swp.koi.dto.request.BidRequestDto;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.AuctionTypeNameEnum;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.repository.*;
import swp.koi.service.authService.GetUserInfoByUsingAuth;
import swp.koi.service.mailService.EmailServiceImpl;
import swp.koi.service.memberService.MemberServiceImpl;
import swp.koi.service.redisService.RedisServiceImpl;
import swp.koi.service.socketIoService.EventListenerFactoryImpl;
import swp.koi.service.socketIoService.SocketDetail;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {

    // Injecting the necessary repositories and services via constructor injection
    private final BidRepository bidRepository;
    private final MemberServiceImpl memberService;
    private final LotRepository lotRepository;
    private final LotRegisterRepository lotRegisterRepository;
    private final AccountRepository accountRepository;
    private final EventListenerFactoryImpl socketService;
    private final RedisServiceImpl redisServiceImpl;
    private final GetUserInfoByUsingAuth getUserInfoByUsingAuth;
    private final EmailServiceImpl emailService;
    private final MemberRepository memberRepository;

    @Override
    public void bid(BidRequestDto bidRequestDto) throws KoiException {
        // Retrieve the Member and Lot based on the DTO
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String accountEmail = auth.getName();

        var account = accountRepository.findByEmail(accountEmail).orElseThrow(NoSuchElementException::new);

        Member member = memberService.getMemberByAccount(account);

        Lot lot = lotRepository.findById(bidRequestDto.getLotId())
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

        // Validate the bid request to ensure it's eligible for placing a bid
        validateBidRequest(bidRequestDto, member, lot);


        // Create a Bid entity and update the Lot with the new bid

        Bid bid = createBid(bidRequestDto, member, lot);
        bidRepository.save(bid);

        if(checkIfAutoBidderExistAndHaveHigherPrice(lot, bidRequestDto.getPrice())){

            Optional<AutoBid> autoBidEntity = Optional.ofNullable(getAutoBidEntity(lot));

            Member memberOfAutoBid = memberService.getMemberById(autoBidEntity.get().getMemberId());

            float updatedPrice = autoBidderCanAffordNewPrice(lot, bidRequestDto.getPrice())
                    ? bidRequestDto.getPrice() + lot.getStartingPrice() * 0.1f
                    : autoBidEntity.get().getAmount();

            Bid autoBid = Bid.builder()
                    .bidAmount(updatedPrice)
                    .member(memberOfAutoBid)
                    .lot(lot)
                    .build();

            bidRepository.save(autoBid);
            lot = updateLotWithSpecialType(updatedPrice, lot, memberOfAutoBid);

        } else if (checkIfAutoBidderExistAndHaveLowerPrice(lot, bidRequestDto.getPrice())) {
            Optional<AutoBid> autoBidEntity = Optional.ofNullable(getAutoBidEntity(lot));

            String subject = "\uD83D\uDD34 Outbid. Raise your bid of "
                    + autoBidEntity.get().getAmount()
                    + " for lot with id " + lot.getLotId();

            emailService.sendEmail("mentionable9999@gmail.com",subject,"idk bro");
            redisServiceImpl.deleteData("Auto_bid_"+lot.getLotId().toString());
            lot = updateLotWithSpecialType(bidRequestDto.getPrice(), lot, member);

        } else {
            lot = updateLotWithSpecialType(bidRequestDto.getPrice(), lot, member);
        }

        updateDataOnClient(lot.getLotId(),bidRequestDto.getPrice(),account.getFirstName());

        lotRepository.save(lot);
    }

    private void updateDataOnClient(int lotId, float amount, String bidderName) throws KoiException {

        SocketDetail socketDetail = SocketDetail.builder()
                .winnerName(bidderName)
                .newPrice(amount)
                .lotId(lotId)
                .build();

        socketService.sendDataToClient(socketDetail, String.valueOf(lotId));

    }

    @Override
    public List<Bid> listBidByLotId(int lotId) throws KoiException {
        // Find the Lot by ID and fetch all bids associated with it
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

        return bidRepository.getBidByLot(lot)
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND)); // Handle case where no bids are found
    }

    @Override
    public void activeAutoBid(AutoBidRequestDTO autoBidRequestDTO) throws KoiException {

        Lot lot = lotRepository.findById(autoBidRequestDTO.getLotId())
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

        Member member = getUserInfoByUsingAuth.getMemberFromAuth();
        Optional<AutoBid> autoBidEntity = Optional.ofNullable(getAutoBidEntity(lot));

        float incrementPrice = lot.getStartingPrice() * 0.1f; // Example increment price calculation

        if (autoBidEntity.isEmpty()) {
            handleNoExistingAutoBid(autoBidRequestDTO, lot, member, incrementPrice);
        } else {
            handleExistingAutoBid(autoBidRequestDTO, lot, member, autoBidEntity.get(), incrementPrice);
        }


    }

    // Validates the bid request, ensuring the member is registered and that the bid price is valid
    private void validateBidRequest(BidRequestDto bidRequestDto, Member member, Lot lot) throws KoiException {
        // Check if the member is registered for the lot and update their status if needed
        boolean isRegistered = lotRegisterRepository.findByLot(lot)
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND))
                .stream()
                .anyMatch(lr -> lr.getMember().equals(member) && updateLotRegisterStatus(lr)); // Update status to "BIDDING"

        if (!isRegistered) {
            throw new KoiException(ResponseCode.MEMBER_NOT_REGISTERED_FOR_LOT);
        }

        if (LocalDateTime.now().isAfter(lot.getEndingTime())) {
            throw new KoiException(ResponseCode.BID_TIME_PASSED);
        }

        AuctionTypeNameEnum auctionType = lot.getAuction().getAuctionType().getAuctionTypeName();

        switch (auctionType) {
            case ASCENDING_BID: {
                //jump price 10% of current price
                if (bidRequestDto.getPrice() < lot.getCurrentPrice() + lot.getStartingPrice() * 0.1)
                    throw new KoiException((ResponseCode.BID_PRICE_TOO_LOW));
                return;
            }
            case SEALED_BID: {
                if (validateBidTypeSealed(member, lot)) {
                    throw new KoiException(ResponseCode.BID_SEALED_ALREADY);
                }
                return;
            }
            case DESCENDING_BID: {
                if (!(bidRequestDto.getPrice() == lot.getCurrentPrice()))
                    throw new KoiException((ResponseCode.BID_PRICE_TOO_LOW));
                return;
            }
            case FIXED_PRICE_SALE: {
                if (bidRequestDto.getPrice() != lot.getCurrentPrice()) {
                    throw new KoiException((ResponseCode.BID_PRICE_TOO_LOW));

                }

                return;
            }
            default:
                throw new KoiException((ResponseCode.AUCTION_TYPE_NOT_FOUND));
        }
    }

    // Updates the status of the LotRegister to "BIDDING"
    private boolean updateLotRegisterStatus(LotRegister lotRegister) {
        lotRegister.setStatus(LotRegisterStatusEnum.BIDDING);
        return true; // Return true to indicate that the status was updated
    }

    // Creates a new Bid object with the provided bid request data
    private Bid createBid(BidRequestDto bidRequestDto, Member member, Lot lot) {
        return Bid.builder()
                .bidAmount(bidRequestDto.getPrice()) // Set bid amount
                .member(member) // Associate the bid with the member
                .lot(lot) // Associate the bid with the lot
                .build();
    }

    private Lot updateLotWithAscendingType(float newPrice, Lot lot, Member member) {

        lot.setCurrentPrice(newPrice);
        lot.setCurrentMemberId(member.getMemberId());
        Duration timeDifference = Duration.between(LocalDateTime.now(), lot.getEndingTime());
        //if ending time is less than 15 mins -> add another 10 mins to ending time
        if (timeDifference.toMinutes() <= 15) {
            lot.setEndingTime(lot.getEndingTime().plusMinutes(10));
        }
        return lot;
    }

    private Lot updateLotWithDescendingType(float newPrice, Lot lot, Member member) {

        lot.setCurrentPrice(newPrice);
        lot.setCurrentMemberId(member.getMemberId());
        lot.setEndingTime(LocalDateTime.now());

        return lot;
    }


    //after validate then update the lot according to lot auction type
    private Lot updateLotWithSpecialType(float newPrice, Lot lot, Member member) {
        return switch (lot.getAuction().getAuctionType().getAuctionTypeName()) {
            case ASCENDING_BID -> updateLotWithAscendingType(newPrice, lot, member);
            case DESCENDING_BID -> updateLotWithDescendingType(newPrice, lot, member);
            default -> lot;
        };
    }

    private boolean validateBidTypeSealed(Member member, Lot lot) throws KoiException {

        List<Bid> bidList = bidRepository.getBidByLot(lot)
                .orElseThrow(() -> new KoiException(ResponseCode.BID_LIST_EMPTY));

        return bidList.stream().anyMatch(lr -> lr.getMember().equals(member));
    }

    private AutoBid getAutoBidEntity(Lot lot) {
        return (AutoBid) redisServiceImpl.getData("Auto_bid_" + lot.getLotId());
    }

    private boolean checkIfAutoBidderExistAndHaveHigherPrice(Lot lot, float bidAmount) {
        Optional<AutoBid> autoBidEntity = Optional.ofNullable(getAutoBidEntity(lot));
        return autoBidEntity.isPresent() && bidAmount <= autoBidEntity.get().getAmount();
    }

    private boolean autoBidderCanAffordNewPrice(Lot lot, float bidAmount) {
        Optional<AutoBid> autoBidEntity = Optional.ofNullable(getAutoBidEntity(lot));
        return autoBidEntity.isPresent()
                && autoBidEntity.get().getAmount() >= bidAmount + lot.getStartingPrice() * 0.1;
    }

    private boolean checkIfAutoBidderExistAndHaveLowerPrice(Lot lot, float bidAmount){
        Optional<AutoBid> autoBidEntity = Optional.ofNullable(getAutoBidEntity(lot));
        return autoBidEntity.isPresent() && bidAmount > autoBidEntity.get().getAmount();
    }

    private void handleNoExistingAutoBid(AutoBidRequestDTO autoBidRequestDTO,
                                         Lot lot, Member member,
                                         float incrementPrice) {
        float currentPrice = lot.getCurrentPrice();
        float minAutoBid = currentPrice + incrementPrice;

        if (lot.getBids().isEmpty()) {
            // Case 1.2: No one has bid before
            bidAndSaveAutoBid(member, lot, minAutoBid, autoBidRequestDTO.getAmount());
        } else {
            // Case 1.1: Someone already bid
            float newBidPrice = currentPrice + incrementPrice;
            bidAndSaveAutoBid(member, lot, newBidPrice, autoBidRequestDTO.getAmount());
        }
    }

    private void handleExistingAutoBid(AutoBidRequestDTO autoBidRequestDTO,
                                       Lot lot, Member member,
                                       AutoBid existingAutoBid,
                                       float incrementPrice) {
        float newMaxPrice = autoBidRequestDTO.getAmount();
        float oldMaxPrice = existingAutoBid.getAmount();


        if(member.getMemberId().equals(existingAutoBid.getMemberId())){

            AutoBid autoBid = AutoBid.builder()
                    .amount(newMaxPrice)
                    .memberId(member.getMemberId())
                    .build();
            redisServiceImpl.saveDataWithoutTime("Auto_bid_" + lot.getLotId(), autoBid);

            return;
        }

        if (newMaxPrice > oldMaxPrice) {
            if (newMaxPrice >= oldMaxPrice + incrementPrice) {
                // Case 2.1a: New max price >= old max price + increment
                bidAndSaveAutoBid(member, lot, oldMaxPrice + incrementPrice, newMaxPrice);
            } else {
                // Case 2.1b: New max price < old max price + increment
                bidAndSaveAutoBid(member, lot, newMaxPrice, newMaxPrice);
            }
        } else {
            int autoBidderId = existingAutoBid.getMemberId();

            if (oldMaxPrice >= newMaxPrice + incrementPrice) {
                // Case 2.2a: Old max price >= new max price + increment
                logBid(newMaxPrice, member,lot);

                float outBidPrice = newMaxPrice + incrementPrice;
                activeOldAutoBid(autoBidderId,outBidPrice, lot);
            } else {
                // Case 2.2b: Old max price < new max price + increment
                logBid(newMaxPrice, member,lot);
                activeOldAutoBid(autoBidderId, oldMaxPrice, lot);
            }
        }
    }

    private void bidAndSaveAutoBid(Member member, Lot lot, float bidAmount, float maxAutoBidAmount) {
        Bid bid = Bid.builder()
                .bidAmount(bidAmount)
                .member(member)
                .lot(lot)
                .build();
        bidRepository.save(bid);

        AutoBid autoBid = AutoBid.builder()
                .amount(maxAutoBidAmount)
                .memberId(member.getMemberId())
                .build();
        redisServiceImpl.saveDataWithoutTime("Auto_bid_" + lot.getLotId(), autoBid);

        Lot updatedLot = updateLotWithSpecialType(bidAmount, lot, member);
        lotRepository.save(updatedLot);
    }

    private void logBid(float bidAmount, Member member, Lot lot) {
        Bid bid = Bid.builder()
                .bidAmount(bidAmount)
                .member(member)
                .lot(lot)
                .bidTime(LocalDateTime.now())
                .build();
        bidRepository.save(bid);
    }

    private void activeOldAutoBid(int autoBidderId, float outBidPrice, Lot lot) {
        Member autoBidderMember = memberRepository.findById(autoBidderId)
                .orElseThrow(() -> new KoiException(ResponseCode.MEMBER_NOT_FOUND));

        logBid(outBidPrice, autoBidderMember, lot);

        Lot updatedLot = updateLotWithSpecialType(outBidPrice, lot, autoBidderMember);
        lotRepository.save(updatedLot);
    }
}
