package swp.koi.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.Media;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KoiFishDTO {

    String varietyName;
    String gender;
    int age;
    float size;
    float price;
    MediaDTO media;
}
