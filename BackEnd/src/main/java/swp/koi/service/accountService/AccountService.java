package swp.koi.service.accountService;

import jakarta.servlet.http.HttpServletRequest;
import swp.koi.dto.request.AccountLoginDTO;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.dto.response.AuthenticateResponse;
import swp.koi.model.Account;

import javax.security.auth.login.AccountNotFoundException;

public interface AccountService {
    AccountRegisterDTO findByAccountId(Integer accountId);
    Account createAccount(Account account);
    Account createAccountByRequest(AccountRegisterDTO request);
    Account findByEmail(String emai);
    AuthenticateResponse login(AccountLoginDTO request);
    AuthenticateResponse refreshToken(HttpServletRequest request) throws AccountNotFoundException;
}
