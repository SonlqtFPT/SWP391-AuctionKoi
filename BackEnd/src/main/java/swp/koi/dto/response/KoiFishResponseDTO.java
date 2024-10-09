package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.AuctionType;
import swp.koi.model.enums.AuctionTypeNameEnum;
import swp.koi.model.enums.KoiFishStatusEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KoiFishResponseDTO {

    Integer fishId;
    String gender;
    int age;
    float size;
    float price;
    AuctionTypeNameEnum auctionTypeName;
    KoiFishStatusEnum status;
    MediaResponseDTO media;
    VarietyResponseDTO variety;

}
