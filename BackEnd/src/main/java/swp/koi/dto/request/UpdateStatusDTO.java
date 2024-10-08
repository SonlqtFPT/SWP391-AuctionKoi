package swp.koi.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.AuctionRequest;
import swp.koi.model.enums.AuctionRequestStatusEnum;
import swp.koi.model.enums.KoiFishStatusEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateStatusDTO {

    AuctionRequestStatusEnum requestStatus;

}
