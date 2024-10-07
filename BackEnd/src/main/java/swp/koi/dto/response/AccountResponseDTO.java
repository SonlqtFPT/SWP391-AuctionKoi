package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AccountRoleEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResponseDTO {

    Integer accountId;
    String email;
    String firstName;
    String lastName;
    String phoneNumber;
    AccountRoleEnum role;

}