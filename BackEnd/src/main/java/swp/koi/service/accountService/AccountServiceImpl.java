package swp.koi.service.accountService;

import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Account;
import swp.koi.repository.AccountRepository;

@Service
public class AccountServiceImpl implements AccountService{

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository){
        this.accountRepository = accountRepository;
    }

    @Override
    public Account findByAccountId(Integer accountId) {
        return accountRepository.findByAccountId(accountId).orElseThrow(() -> new KoiException(ResponseCode.NOT_FOUND));
    }

}
