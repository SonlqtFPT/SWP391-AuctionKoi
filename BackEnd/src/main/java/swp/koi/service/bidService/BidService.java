package swp.koi.service.bidService;

import swp.koi.dto.request.AutoBidRequestDTO;
import swp.koi.dto.request.BidRequestDto;
import swp.koi.dto.response.BidResponseDTO;
import swp.koi.exception.KoiException;
import swp.koi.model.Bid;
import swp.koi.model.Lot;

import java.util.List;
import java.util.Optional;

public interface BidService {

    void bid(BidRequestDto bidRequestDto);

    List<Bid> listBidByLotId(int lotId);

    void activeAutoBid(AutoBidRequestDTO autoBidRequestDTO) throws KoiException;

    boolean isUserBidded(int lotId);

    Optional<Integer> countNumberOfPeopleWhoBidOnSpecificLot(int lotId);
}
