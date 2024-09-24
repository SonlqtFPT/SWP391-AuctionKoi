package swp.koi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.koi.model.Account;
import swp.koi.repository.AccountRepository;

import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public List<Account> getAllAccount() {
        return accountRepository.findAll();
    }
}
