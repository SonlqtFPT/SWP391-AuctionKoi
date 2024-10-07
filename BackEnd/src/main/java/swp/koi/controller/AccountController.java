package swp.koi.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.dto.request.AccountLoginDTO;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.dto.request.LogoutDTO;
import swp.koi.dto.request.KoiBreederDTO;
import swp.koi.dto.response.AuthenticateResponse;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.service.accountService.AccountService;
import swp.koi.service.jwtService.JwtService;
import swp.koi.service.redisService.RedisService;
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
    public ResponseData<?> loginGoogle(@AuthenticationPrincipal OidcUser principal){
        return new ResponseData<>(ResponseCode.SUCCESS);
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
