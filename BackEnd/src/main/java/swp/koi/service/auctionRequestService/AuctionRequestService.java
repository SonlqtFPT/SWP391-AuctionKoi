package swp.koi.service.auctionRequestService;

import swp.koi.dto.request.*;
import swp.koi.model.AuctionRequest;

import java.util.List;

public interface AuctionRequestService {
    AuctionRequest createRequest(AuctionRequestDTO request);

    List<AuctionRequest> getAllAuctionRequest();

    AuctionRequest findByRequestId(Integer requestId);

    void saveRequest(AuctionRequest auctionRequest);

    void assignStaffToRequest(Integer requestId, Integer accountId);

    List<AuctionRequest> getAllStaffRequest(Integer accountId);

    List<AuctionRequest> getAllBreederRequest(Integer accountId);

    void breederCancelRequest(Integer requestId);

    AuctionRequest updateRequest(Integer requestId, AuctionRequestUpdateDTO auctionRequest);

    void changeStatus(Integer requestId, UpdateStatusDTO request);

    void managerNegotiation(Integer requestId, AuctionRequestNegotiationManagerDTO request);

    void acceptNegotiation(Integer requestId);

    void sendReNegotiation(Integer requestId, KoiFishNegotiationDTO koiFishNegotiationDTO);

    void managerAcceptNegotiation(Integer requestId);

    void managerCancelRequest(Integer requestId);

    void managerAcceptRequest(Integer requestId);

    AuctionRequest getRequestDetail(Integer requestId);

    List<AuctionRequest> getAllPendingRequest(Integer accountId);

    List<AuctionRequest> getAllInspectionPendingRequest(Integer accountId);

    List<AuctionRequest> getAllInspectionPassedRequest(Integer accountId);

    List<AuctionRequest> getAllInspectionFailedRequest(Integer accountId);

    List<AuctionRequest> getAllNegotiatingRequest(Integer accountId);

    List<AuctionRequest> getAllApprovedRequest(Integer accountId);

    List<AuctionRequest> getAllRejectedRequest(Integer accountId);

    List<AuctionRequest> getAllCancelledRequest(Integer accountId);
}
