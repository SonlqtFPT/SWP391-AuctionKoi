package swp.koi.service.accountService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import swp.koi.dto.request.AccountLoginDTO;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.dto.response.AccountResponseDTO;
import swp.koi.model.Account;

public interface AccountService {
    AccountRegisterDTO findByAccountId(Integer accountId);
    Account createAccount(Account account);
    Account createAccountByRequest(AccountRegisterDTO request);
    Account findByEmail(String emai);
    void login(AccountLoginDTO request);
}
