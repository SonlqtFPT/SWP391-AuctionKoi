package swp.koi.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticateResponse {

    AccountResponseDTO account;
    private String accessToken;
    private String refreshToken;

}
