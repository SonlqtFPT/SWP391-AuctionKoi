package swp.koi.service.accountService;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import swp.koi.dto.request.AccountLoginDTO;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.Account;
import swp.koi.model.enums.AccountRoleEnum;
import swp.koi.repository.AccountRepository;
import swp.koi.security.SecurityConfiguration;

@Service
public class AccountServiceImpl implements AccountService{

    private final AccountRepository accountRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AccountServiceImpl(AccountRepository accountRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager){
        this.accountRepository = accountRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AccountRegisterDTO findByAccountId(Integer accountId) {
        return accountRepository.findByAccountId(accountId).orElseThrow(() -> new KoiException(ResponseCode.NOT_FOUND));
    }

    @Override
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public Account createAccountByRequest(@Valid AccountRegisterDTO request) throws KoiException{
        Account account = new Account();

        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new KoiException(ResponseCode.EMAIL_ALREADY_EXISTS);
        }

        modelMapper.map(request, account);
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(AccountRoleEnum.MEMBER);
        account.setStatus(true);

        return accountRepository.save(account);
    }

    @Override
    public Account findByEmail(String emai) {
        return accountRepository.findByEmail(emai).orElseThrow(() -> new KoiException(ResponseCode.INVALID_INFORMATION));
    }

    @Override
    public void login(AccountLoginDTO request) throws KoiException{
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException e) {
            throw new KoiException(ResponseCode.INVALID_CREDENTIALS);
        }
    }
}
