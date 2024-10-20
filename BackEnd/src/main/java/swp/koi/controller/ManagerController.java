package swp.koi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.AccountEntityToDtoConverter;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.dto.response.AccountFullResponseDto;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.service.accountService.AccountService;

import java.util.List;

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
@Tag(name = "manager", description = "Everything about your manager operation")
public class ManagerController {

    private final AccountEntityToDtoConverter accountEntityToDtoConverter;
    private final AccountService accountService;

    @Operation(summary = "Create manager account")
    @PostMapping("/manager/create-manager-account")
    public ResponseData<?> createManagerAccount(AccountRegisterDTO request){
        accountService.createManagerAccountByRequest(request);
        return new ResponseData<>(ResponseCode.SUCCESS_SIGN_UP);
    }

    @Operation(summary = "Retrieve all account")
    @GetMapping("/manager/get-all-account")
    public ResponseData<?> getAllAccount(){
        List<AccountFullResponseDto> response = accountEntityToDtoConverter
                .convertAccountFullList(accountService.getAllAccount());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Disable an account")
    @PatchMapping("/manager/disable-account")
    public ResponseData<?> disableAccount(@RequestParam Integer accountId){
        accountService.disableAccount(accountId);
        return new ResponseData<>(ResponseCode.DISABLE_SUCCESS);
    }
}
