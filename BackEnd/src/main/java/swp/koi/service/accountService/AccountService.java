package swp.koi.service.accountService;

import swp.koi.model.Account;

public interface AccountService {
    Account findByAccountId(Integer accountId);
}
