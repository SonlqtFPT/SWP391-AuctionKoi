package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.LotStatusEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FullLotResponseDTO {

    Integer lotId;
    float deposit;
    float startingPrice;
    float increment;
    Integer currentMemberId;
    float currentPrice;
    LotStatusEnum status;
    KoiFishResponseDTO koiFish;
    AuctionTypeResponseDTO auctionType;

}
