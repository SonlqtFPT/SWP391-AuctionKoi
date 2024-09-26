package swp.koi.service.bidService;

import swp.koi.dto.response.requestDto.BidRequestDto;
import swp.koi.model.Bid;

import java.util.List;

public interface BidService {
    void bid(BidRequestDto bidRequestDto);

    List<Bid> listBidByLotId(int lotId);
}
