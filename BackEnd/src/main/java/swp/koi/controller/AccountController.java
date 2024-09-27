package swp.koi.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.dto.request.AccountLoginDTO;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.service.accountService.AccountService;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/login")
    public ResponseData<String> login(@Valid @RequestBody AccountLoginDTO request){
        try{
            accountService.login(request);
            return new ResponseData<>(ResponseCode.SUCCESS_LOGIN);
        }catch(KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/signup")
    public ResponseData<String> signup(@Valid @RequestBody AccountRegisterDTO request){

        try{
            accountService.createAccountByRequest(request);
            return new ResponseData<>(ResponseCode.SUCCESS_SIGN_UP);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }


    }

}
