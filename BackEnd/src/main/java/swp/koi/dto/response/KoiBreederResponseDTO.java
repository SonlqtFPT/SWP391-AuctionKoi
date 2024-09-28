package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KoiBreederResponseDTO {

    Integer breederId;
    String breederName;
    String location;

}
