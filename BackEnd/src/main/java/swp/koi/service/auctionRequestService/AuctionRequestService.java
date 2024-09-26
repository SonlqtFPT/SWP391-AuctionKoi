package swp.koi.service.auctionRequestService;

import org.springframework.data.repository.query.Param;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.model.AuctionRequest;
import swp.koi.model.enums.AuctionRequestStatusEnum;

import java.util.List;

public interface AuctionRequestService {
    AuctionRequest createRequest(AuctionRequestDTO request);

    List<AuctionRequest> getAllAuctionRequest();
}
