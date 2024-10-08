package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LotResponseDto {
    Integer lotId;
    float deposit;
    float startingPrice;
    LocalDateTime startingTime;
    LocalDateTime endingTime;
    float increment;
    Integer currentMemberId;
    float currentPrice;
    KoiFishInLotResponseDto koiFish;
}
