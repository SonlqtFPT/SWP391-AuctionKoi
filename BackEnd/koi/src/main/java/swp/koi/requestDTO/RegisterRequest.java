package swp.koi.requestDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest implements Serializable {

    String display_name;

    String email;

    String password;

    String phone_number;
}
