package swp.koi.service.bidService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.BidRequestDto;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.AuctionTypeNameEnum;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.model.enums.LotStatusEnum;
import swp.koi.repository.AccountRepository;
import swp.koi.repository.BidRepository;
import swp.koi.repository.LotRegisterRepository;
import swp.koi.repository.LotRepository;
import swp.koi.service.accountService.AccountService;
import swp.koi.service.lotService.LotServiceImpl;
import swp.koi.service.memberService.MemberServiceImpl;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {

    // Injecting the necessary repositories and services via constructor injection
    private final BidRepository bidRepository;
    private final MemberServiceImpl memberService;
    private final LotRepository lotRepository;
    private final LotRegisterRepository lotRegisterRepository;
    private final AccountRepository accountRepository;


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

        lot = updateLotWithSpecialType(bidRequestDto.getPrice(), lot, member);

        // Persist the bid and the updated lot into the repository
        bidRepository.save(bid);
        lotRepository.save(lot);
    }

    @Override
    public List<Bid> listBidByLotId(int lotId) throws KoiException {
        // Find the Lot by ID and fetch all bids associated with it
        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

        return bidRepository.getBidByLot(lot)
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND)); // Handle case where no bids are found
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
                if(validateBidTypeSealed(member,lot)){
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
                };
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

}
