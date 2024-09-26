package swp.koi.service.auctionService;

import jakarta.validation.Valid;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.model.Auction;

public interface AuctionService {
    Auction createAuctionWithLots(@Valid AuctionWithLotsDTO request);
}
