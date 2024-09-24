package swp.koi.service.accountService;

import swp.koi.entity.Account;
import swp.koi.requestDTO.RegisterRequest;

public interface AccountService {

    public Account registerAccount(RegisterRequest registerRequest);

}
