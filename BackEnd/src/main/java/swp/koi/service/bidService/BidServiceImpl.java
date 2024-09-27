package swp.koi.service.bidService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.BidRequestDto;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Bid;
import swp.koi.model.Lot;
import swp.koi.model.LotRegister;
import swp.koi.model.Member;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.repository.BidRepository;
import swp.koi.repository.LotRegisterRepository;
import swp.koi.repository.LotRepository;
import swp.koi.service.memberService.MemberServiceImpl;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService{

    // Injecting the necessary repositories and services via constructor injection
    private final BidRepository bidRepository;
    private final MemberServiceImpl memberService;
    private final LotRepository lotRepository;
    private final LotRegisterRepository lotRegisterRepository;

    @Override
    public void bid(BidRequestDto bidRequestDto) throws KoiException {
        try{
            // Retrieve the Member and Lot based on the DTO
            Member member = memberService.getMemberById(bidRequestDto.getMemberId());
            Lot lot = lotRepository.findById(bidRequestDto.getLotId())
                    .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

            // Validate the bid request to ensure it's eligible for placing a bid
            validateBidRequest(bidRequestDto, member, lot);

            // Create a Bid entity and update the Lot with the new bid
            Bid bid = createBid(bidRequestDto, member, lot);
            updateLotWithNewBid(bidRequestDto.getPrice(), lot);

            // Persist the bid and the updated lot into the repository
            bidRepository.save(bid);
            lotRepository.save(lot);
        }catch (KoiException e){
            throw e;
        }
    }

    @Override
    public List<Bid> listBidByLotId(int lotId) throws KoiException{
        try{
            // Find the Lot by ID and fetch all bids associated with it
            Lot lot = lotRepository.findById(lotId)
                    .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));
            return bidRepository.getBidByLot(lot)
                    .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND)); // Handle case where no bids are found
        }catch (KoiException e){
            throw e;
        }
    }

    // Validates the bid request, ensuring the member is registered and that the bid price is valid
    private void validateBidRequest(BidRequestDto bidRequestDto, Member member, Lot lot) throws KoiException{
        try{
            // Check if the member is registered for the lot and update their status if needed
            boolean isRegistered = lotRegisterRepository.findByLot(lot)
                    .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND))
                    .stream()
                    .anyMatch(lr -> lr.getMember().equals(member) && updateLotRegisterStatus(lr)); // Update status to "BIDDING"

            if (!isRegistered) {
                throw new KoiException(ResponseCode.MEMBER_NOT_REGISTERED_FOR_LOT);
            }else if(bidRequestDto.getPrice() <= lot.getCurrentPrice()){
                throw new KoiException((ResponseCode.BID_PRICE_TOO_LOW));
            }
        }catch (KoiException e){
            throw e;
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
                .bidTime(new Date()) // Record the current date/time for the bid
                .member(member) // Associate the bid with the member
                .lot(lot) // Associate the bid with the lot
                .build();
    }

    // Updates the current price of the lot with the new bid price
    private void updateLotWithNewBid(float newPrice, Lot lot) {
        lot.setCurrentPrice(newPrice); // Set the new highest bid as the current price
    }
}
