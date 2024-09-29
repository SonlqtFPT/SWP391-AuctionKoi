package swp.koi.service.koiFishService;

import org.springframework.data.repository.query.Param;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.dto.request.MediaDTO;
import swp.koi.dto.response.KoiFishResponseDTO;
import swp.koi.model.AuctionRequest;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.AuctionRequestStatusEnum;

import java.util.List;

public interface KoiFishService {
    KoiFish createKoiFishFromRequest(KoiFishDTO koiRequest, MediaDTO mediaRequest);
    KoiFish findByFishId(Integer fishId);

    List<KoiFish> getKoiFishFromApproveRequest();

    void saveFish(KoiFish koiFish);
}
