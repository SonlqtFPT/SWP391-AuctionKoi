package swp.koi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AuctionStatusEnum;

import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionWithLotsDTO {

    @NotNull(message = "Start time can not be null")
    java.time.LocalDateTime startTime;
    @NotNull(message = "End time can not be null")
    java.time.LocalDateTime endTime;
    List<LotDTO> lots;

}
