package swp.koi.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.dto.request.*;
import swp.koi.dto.response.AuthenticateResponse;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.service.accountService.AccountService;
import swp.koi.service.koiBreederService.KoiBreederService;

import javax.security.auth.login.AccountNotFoundException;

@RestController
@RequestMapping("/authenticate")
@RequiredArgsConstructor
public class AccountController {


    private final AccountService accountService;
    private final KoiBreederService koiBreederService;

    @PostMapping("/login")
    public ResponseData<?> login(@Valid @RequestBody AccountLoginDTO request) {
        try {
            var tokenResponse = accountService.login(request);

            return new ResponseData<>(ResponseCode.SUCCESS_LOGIN.getCode(),
                    "Token generated successfully",
                    tokenResponse);

        } catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/login-google")
    public ResponseData<AuthenticateResponse> loginGoogle(@RequestBody GoogleTokenRequestDto idToken){
        AuthenticateResponse authenticateResponse = accountService.loginGoogle(idToken);
        return new ResponseData<>(ResponseCode.SUCCESS, authenticateResponse);
    }

    @PostMapping("/signup")
    public ResponseData<String> signup(@Valid @RequestBody AccountRegisterDTO request) {

        try {
            accountService.createAccountByRequest(request);
            return new ResponseData<>(ResponseCode.SUCCESS_SIGN_UP);
        } catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }


    }

    @PostMapping("/refreshToken")
    public ResponseData<?> refresh(@Valid HttpServletRequest request) throws AccountNotFoundException {

        try {
            AuthenticateResponse authenticateResponse = accountService.refreshToken(request);

            return new ResponseData<>(ResponseCode.SUCCESS.getCode(),
                    "Token refreshed successfully",
                    authenticateResponse);

        } catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode().getCode(),"Invalid refresh token");
        }
    }

    @PostMapping("/logout")
    public ResponseData<?> logout(@Valid @RequestBody LogoutDTO logoutDTO) {

        accountService.logout(logoutDTO);

        return new ResponseData<>(ResponseCode.LOGOUT_JWT);
    }

}
