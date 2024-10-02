package swp.koi.service.koiFishService;

import swp.koi.dto.request.*;
import swp.koi.model.KoiFish;

import java.util.List;

public interface KoiFishService {
    KoiFish createKoiFishFromRequest(KoiFishDTO koiRequest, MediaDTO mediaRequest);
    KoiFish findByFishId(Integer fishId);

    List<KoiFish> getKoiFishFromApproveRequest();

    void saveFish(KoiFish koiFish);

    KoiFish updateFish(KoiFishUpdateDTO koiFishUpdateDTO, MediaUpdateDTO mediaDTO);

    List<KoiFish> getKoiFishBasedOnType(AuctionTypeDTO auctionTypeDTO);
}
