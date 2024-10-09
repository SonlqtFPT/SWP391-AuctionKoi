package swp.koi.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AuctionTypeNameEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionTypeResponseDTO {

    Integer auctionTypeId;
    AuctionTypeNameEnum auctionTypeName;

}
