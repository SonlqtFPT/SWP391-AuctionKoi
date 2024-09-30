package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.AuctionRequestStatusEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionRequestResponseDTO {

    Integer requestId;
    AuctionRequestStatusEnum status;
    KoiBreederResponseDTO breeder;
    KoiFishResponseDTO KoiFish;

}
