package swp.koi.service.auctionService;

import jakarta.validation.Valid;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.dto.request.UpdateStatusDTO;
import swp.koi.dto.response.AuctionResponseDTO;
import swp.koi.model.Auction;

public interface AuctionService {
    AuctionResponseDTO createAuctionWithLots(@Valid AuctionWithLotsDTO request);
}
