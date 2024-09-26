package swp.koi.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LotDTO {

    Integer fishId;
    float deposit;
    float startingPrice;
    float increment;
    java.time.LocalDateTime startingTime;
    java.time.LocalDateTime endingTime;
}
