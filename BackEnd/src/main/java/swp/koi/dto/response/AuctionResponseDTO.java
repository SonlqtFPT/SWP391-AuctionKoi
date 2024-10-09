package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.Lot;
import swp.koi.model.enums.AuctionStatusEnum;

import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionResponseDTO {

    Integer auctionId;
    java.time.LocalDateTime startTime;
    java.time.LocalDateTime endTime;
    AuctionStatusEnum status;
    List<LotResponseDto> lots;

}
