package swp.koi.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LotDTO {

    @NotNull (message = "Fish ID cannot be null")
    Integer fishId;

    @Min(value = 0, message = "Deposit must be a positive value")
    float deposit;

    @Min(value = 0, message = "Starting price must be a positive value")
    float startingPrice;

    @Min(value = 0, message = "Increment value must be a positive value")
    float increment;
}
