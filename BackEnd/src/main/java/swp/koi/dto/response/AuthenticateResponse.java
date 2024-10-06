package swp.koi.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticateResponse {

    AccountResponseDTO account;

public class AuthenticateResponse {

    private int memberId;
    private int breederId;

    private String accessToken;
    private String refreshToken;

}
