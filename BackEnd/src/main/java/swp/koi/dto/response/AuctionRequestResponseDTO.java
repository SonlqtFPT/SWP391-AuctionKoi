package swp.koi.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuctionRequestResponseDTO {

    Integer requestId;
    AuctionRequestStatusEnum status;
    KoiBreederResponseDTO breeder;
    AccountResponseDTO staff;
    KoiFishResponseDTO KoiFish;

}
