package swp.koi.service.bidService;

import swp.koi.dto.request.BidRequestDto;
import swp.koi.dto.response.BidResponseDTO;
import swp.koi.model.Bid;

import java.util.List;

public interface BidService {
    void bid(BidRequestDto bidRequestDto);

    List<Bid> listBidByLotId(int lotId);
}
