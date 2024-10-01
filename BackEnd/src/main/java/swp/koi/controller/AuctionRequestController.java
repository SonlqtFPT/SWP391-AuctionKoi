package swp.koi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.AccountEntityToDtoConverter;
import swp.koi.convert.AuctionRequestEntityToDtoConverter;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.response.*;
import swp.koi.exception.KoiException;
import swp.koi.service.accountService.AccountService;
import swp.koi.service.auctionRequestService.AuctionRequestService;
import swp.koi.service.koiBreederService.KoiBreederService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AuctionRequestController {

    private final AuctionRequestService auctionRequestService;
    private final AuctionRequestEntityToDtoConverter auctionRequestEntityToDtoConverter;
    private final KoiBreederService koiBreederService;
    private final AccountEntityToDtoConverter accountEntityToDtoConverter;
    private final AccountService accountService;

    @PostMapping("/breeder/addRequest")
    public ResponseData<AuctionRequestResponseDTO> createRequest(@Valid @RequestBody AuctionRequestDTO request){
        try{
            AuctionRequestResponseDTO response = auctionRequestEntityToDtoConverter
                    .convertAuctionRequest(auctionRequestService.createRequest(request));
            return new ResponseData<>(ResponseCode.CREATED_SUCCESS, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @GetMapping("/breeder/{breederId}")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllBreederRequest(@PathVariable Integer breederId){
        try{
            List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllBreederRequest(breederId), false);
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @GetMapping("/manager/assign-staff/getStaff")
    public ResponseData<List<AccountResponseDTO>> getAllStaff(){
        List<AccountResponseDTO> response = accountEntityToDtoConverter.convertAccountList(accountService.getAllStaff());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @PostMapping("/manager/assign-staff/{requestId}")
    public ResponseData<?> assignStaffToCheck(@PathVariable Integer requestId,
                                              @RequestParam Integer accountId){
        try{
            auctionRequestService.assignStaffToRequest(requestId, accountId);
            return new ResponseData<>(ResponseCode.STAFF_ASSIGN_SUCCESSFULLY);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @GetMapping("/staff/list-request/{accountId}")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllStaffRequest(@PathVariable Integer accountId){
        try{
            List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllStaffRequest(accountId), true);
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }


}


