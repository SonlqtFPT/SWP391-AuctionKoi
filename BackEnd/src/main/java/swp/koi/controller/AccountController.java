package swp.koi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.model.Account;
import swp.koi.service.AccountService;

import java.util.List;

@RestController
@RequestMapping("${api.endpoint.base-url}")
public class AccountController {

    @Autowired
    private AccountService accountService;

    //Get all account list
    @GetMapping("/get")
    public ResponseData<List<Account>> getAllAccount(){
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, accountService.getAllAccount());
    }

}
