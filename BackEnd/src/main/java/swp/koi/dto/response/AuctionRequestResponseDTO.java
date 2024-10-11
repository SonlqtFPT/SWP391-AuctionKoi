package swp.koi.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.AuctionRequestStatusEnum;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionRequestResponseDTO {

    Integer requestId;
    AuctionRequestStatusEnum status;
    LocalDateTime requestedAt;
    String auctionTypeName;
    float offerPrice;
    KoiFishResponseDTO KoiFish;
    KoiBreederResponseDTO breeder;
    AccountResponseDTO staff;

}
