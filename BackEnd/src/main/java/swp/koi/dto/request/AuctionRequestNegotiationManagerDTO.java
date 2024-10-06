package swp.koi.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.AuctionType;
import swp.koi.model.enums.AuctionRequestStatusEnum;
import swp.koi.model.enums.AuctionTypeNameEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionRequestNegotiationManagerDTO {
    float offerPrice;
    String auctionTypeName;
}
