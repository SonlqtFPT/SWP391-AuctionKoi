package swp.koi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.Account;
import swp.koi.model.KoiBreeder;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.AuctionRequestStatusEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionRequestDTO {
    @NotNull(message = "breederId can not be null")
    Integer breederId;
    @NotNull(message = "Koi Fish can not be null")
    KoiFishDTO koiFish;

}
