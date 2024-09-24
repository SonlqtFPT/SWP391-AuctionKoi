package swp.koi.service.accountService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import swp.koi.entity.Account;
import swp.koi.enums.Role;
import swp.koi.repository.AccountRepository;
import swp.koi.requestDTO.RegisterRequest;


@Service
@Slf4j
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    @Override
    public Account registerAccount(RegisterRequest registerRequest) {

        Account account = Account.builder()
                .email(registerRequest.getEmail())
                .password(registerRequest.getPassword())
                .phone_number(registerRequest.getPhone_number())
                .role(Role.MEMBER)
                .build();

        return (accountRepository.save(account));
    }
}
