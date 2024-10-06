package swp.koi.dto.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AuctionTypeNameEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionTypeDTO {

    AuctionTypeNameEnum auctionTypeName;

}
