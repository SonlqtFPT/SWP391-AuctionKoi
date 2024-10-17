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
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

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
    public ResponseData<AuthenticateResponse> loginGoogle(@RequestBody GoogleTokenRequestDto token) throws NoSuchAlgorithmException, InvalidKeySpecException {
        AuthenticateResponse authenticateResponse = accountService.loginGoogle(token);
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

    @PostMapping("/forgot-password")
    public ResponseData<String> forgotPassword(@Valid @RequestBody ForgotPasswordDto request){

        return new ResponseData<>(ResponseCode.SUCCESS, accountService.forgotPassowrd(request));
    }

    @PostMapping("/reset-password")
    public ResponseData<String> resetPassword(@RequestParam String reset_token){

        return new ResponseData<>(ResponseCode.SUCCESS, accountService.resetPassowrd(reset_token));
    }

    @PostMapping("/change-password")
    public ResponseData<String> changePassword(@Valid @RequestBody ResetPasswordDto request, @RequestParam String reset_token){

        return new ResponseData<>(ResponseCode.SUCCESS, accountService.changePassowrd(request, reset_token));
    }

    @PatchMapping("/update-password")
    public ResponseData<String> updatePassword(@Valid @RequestBody UpdatePasswordDto request){
        accountService.updatePassword(request);
        return new ResponseData<>(ResponseCode.CHANGE_PASSWORD_SUCCESS);
    }

    @PostMapping("/update-breeder-profile")
    public ResponseData<?> updateBreederProfile(@Valid @RequestBody UpdateBreederProfileDto request){
        koiBreederService.updateBreederProfile(request);
        return new ResponseData<>(ResponseCode.UPDATE_BREEDER_PROFILE_SUCCESS);
    }

    @PostMapping("/update-profile")
    public ResponseData<?> updateProfile(@Valid @RequestBody UpdateProfileDto request){
        accountService.updateProfile(request);
        return new ResponseData<>(ResponseCode.UPDATE_PROFILE_SUCCESS);
    }

}
