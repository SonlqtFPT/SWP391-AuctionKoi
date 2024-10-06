package swp.koi.service.accountService;

import ch.qos.logback.core.util.StringUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.web.server.ResponseStatusException;

import swp.koi.convert.AccountEntityToDtoConverter;
=======

import swp.koi.dto.request.AccountLoginDTO;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.dto.response.AuthenticateResponse;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Account;
import swp.koi.model.enums.AccountRoleEnum;
import swp.koi.model.enums.TokenType;
import swp.koi.repository.AccountRepository;
import swp.koi.repository.KoiBreederRepository;
import swp.koi.service.jwtService.JwtServiceImpl;
import swp.koi.service.memberService.MemberServiceImpl;
import javax.security.auth.login.AccountNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService{

    private final AccountRepository accountRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final MemberServiceImpl memberService;
    private final JwtServiceImpl jwtService;
    private final KoiBreederRepository koiBreederRepository;
    private final AccountDetailService accountDetailService;

    private final AccountEntityToDtoConverter accountEntityToDtoConverter;



    @Override
    public AccountRegisterDTO findByAccountId(Integer accountId) {
        return accountRepository.findByAccountId(accountId).orElseThrow(() -> new KoiException(ResponseCode.ACCOUNT_ID_NOT_FOUND));
    }

    @Override
    public Account findById(Integer accountId) {
        return accountRepository.findById(accountId).orElseThrow(() -> new KoiException(ResponseCode.ACCOUNT_ID_NOT_FOUND));
    }

    @Override
    public Account createAccount(Account account) throws KoiException{
        if(accountRepository.existsByEmail(account.getEmail()))
            throw new KoiException(ResponseCode.EMAIL_ALREADY_EXISTS);
        else
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
        accountRepository.save(account);

        memberService.createMember(account);

        return account;
    }

    @Override
    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email).orElseThrow(() -> new KoiException(ResponseCode.INVALID_INFORMATION));
    }

    @Override
    public AuthenticateResponse login(AccountLoginDTO request) throws KoiException {
        AuthenticateResponse authenticateResponse;

        Integer breederId = 0;

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            var account = findByEmail(request.getEmail());

            String accessToken = jwtService.generateToken(account.getEmail(), TokenType.ACCESS_TOKEN);

            String refreshToken = jwtService.generateRefreshToken(account.getEmail(), TokenType.REFRESH_TOKEN);


            authenticateResponse = AuthenticateResponse.builder()
                    .account(accountEntityToDtoConverter.convertAccount(account))

            var memberId = memberService.getMemberIdByAccount(account);

            if (account.getRole().equals(AccountRoleEnum.BREEDER)) {
                breederId = koiBreederRepository.findByAccount(account)
                        .get().getBreederId();
            }

            authenticateResponse = AuthenticateResponse.builder()
                    .memberId(memberId)
                    .breederId(breederId)

                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();

        } catch (AuthenticationException e) {
            throw new KoiException(ResponseCode.INVALID_CREDENTIALS);
        }

        return authenticateResponse;
    }

    @Override
    public AuthenticateResponse refreshToken(HttpServletRequest request) throws KoiException {
        Integer breederId = 0;
        String accessToken = null;

        //fetch token
        String refreshToken = request.getHeader("x-token");

        if (StringUtil.isNullOrEmpty(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token is empty");
        }


        String username = jwtService.extractUsername(refreshToken, TokenType.REFRESH_TOKEN);

        //initialize account
        var userDetails = accountDetailService.loadUserByUsername(username);

        var account = findByEmail(username);
//        JwtToken token = (JwtToken) redisService.getData(account.getEmail());
//        System.out.println(token);

        if (jwtService.validateToken(refreshToken, userDetails, TokenType.REFRESH_TOKEN)) {
            accessToken = jwtService.generateToken(username, TokenType.ACCESS_TOKEN);
        } else throw new KoiException(ResponseCode.JWT_INVALID);

        var memberId = memberService.getMemberIdByAccount(account);

        if(account.getRole().equals(AccountRoleEnum.BREEDER)) {
            breederId = koiBreederRepository.findByAccount(account)
                    .get().getBreederId();
        }


        AuthenticateResponse tokenResponse = AuthenticateResponse.builder()
                .account(accountEntityToDtoConverter.convertAccount(account))
                .accessToken(accessToken)
                .refreshToken(refreshToken)


        AuthenticateResponse tokenResponse = AuthenticateResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .breederId(breederId)
                .memberId(memberId)

                .build();


        return tokenResponse;

    }

    @Override
    public List<Account> getAllStaff() {
        List<Account> list = accountRepository.findAll();
        List<Account> staffList = list
                .stream()
                .filter(staff -> staff.getRole() == AccountRoleEnum.STAFF)
                .collect(Collectors.toList());
        return staffList;
    }

    @Override
    public boolean existById(Integer accountId) {
        return accountRepository.existsById(accountId);
    }

    @Override
    public void createAccountStaff(AccountRegisterDTO staffDto) {
        Account account = new Account();
        if(accountRepository.existsByEmail(account.getEmail()))
            throw new KoiException(ResponseCode.EMAIL_ALREADY_EXISTS);
        modelMapper.map(staffDto, account);
        account.setPassword(passwordEncoder.encode(staffDto.getPassword()));
        account.setRole(AccountRoleEnum.STAFF);
        account.setStatus(true);
        accountRepository.save(account);

    }


}
