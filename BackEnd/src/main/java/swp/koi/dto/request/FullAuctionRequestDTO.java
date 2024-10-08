package swp.koi.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FullAuctionRequestDTO {
    @NotNull(message = "Account Id is required")
    Integer accountId;
    @Valid
    FullKoiFishDTO koiFish;

}
