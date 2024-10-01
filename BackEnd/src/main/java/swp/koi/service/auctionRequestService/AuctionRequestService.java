package swp.koi.service.auctionRequestService;

import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.request.AuctionRequestUpdateDTO;
import swp.koi.dto.request.UpdateStatusDTO;
import swp.koi.model.AuctionRequest;

import java.util.List;

public interface AuctionRequestService {
    AuctionRequest createRequest(AuctionRequestDTO request);

    List<AuctionRequest> getAllAuctionRequest();

    AuctionRequest findByRequestId(Integer requestId);

    void saveRequest(AuctionRequest auctionRequest);

    List<AuctionRequest> getAllRequestById(Integer accountId);

    void assignStaffToRequest(Integer requestId, Integer accountId);

    List<AuctionRequest> getAllStaffRequest(Integer accountId);

    List<AuctionRequest> getAllBreederRequest(Integer breederId);

    void cancelRequest(Integer requestId);


    AuctionRequest updateRequest(Integer requestId, AuctionRequestUpdateDTO auctionRequest);

    void changeStatus(Integer requestId, UpdateStatusDTO request);
}
