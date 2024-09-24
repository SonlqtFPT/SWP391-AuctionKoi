package swp.koi.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.entity.Account;
import swp.koi.requestDTO.RegisterRequest;
import swp.koi.service.accountService.AccountServiceImpl;

@RestController
@Slf4j
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AccountServiceImpl accountService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(RegisterRequest registerRequest) {

        Account account = accountService.registerAccount(registerRequest);

        return new ResponseEntity<>(account, HttpStatus.OK);
    }
}
