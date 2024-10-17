package swp.koi.service.accountService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import swp.koi.dto.request.*;
import swp.koi.dto.response.AuthenticateResponse;
import swp.koi.model.Account;

import javax.security.auth.login.AccountNotFoundException;
import java.util.List;

public interface AccountService {
    AccountRegisterDTO findByAccountId(Integer accountId);
    Account findById(Integer accountId);
    Account createAccount(Account account);
    Account createAccountByRequest(AccountRegisterDTO request);
    Account findByEmail(String emai);
    AuthenticateResponse login(AccountLoginDTO request);
    AuthenticateResponse refreshToken(HttpServletRequest request) throws AccountNotFoundException;

    List<Account> getAllStaff();

    boolean existById(@NotNull(message = "Account Id is required") Integer accountId);

    void createAccountStaff(AccountRegisterDTO staffDto);
    void logout(LogoutDTO logoutDTO);

    AuthenticateResponse loginGoogle(GoogleTokenRequestDto googleToken);

    String forgotPassowrd(ForgotPasswordDto request);

    String resetPassowrd(String resetToken);

    String changePassowrd(ResetPasswordDto request, String reset_token);

    void updatePassword(UpdatePasswordDto request);

    void saveAccount(Account account);

    void updateProfile(Integer accountId, @Valid UpdateProfileDto request);
}