package swp.koi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.AccountEntityToDtoConverter;
import swp.koi.convert.AuctionRequestEntityToDtoConverter;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.request.AuctionRequestUpdateDTO;
import swp.koi.dto.request.UpdateStatusDTO;
import swp.koi.dto.response.*;
import swp.koi.exception.KoiException;
import swp.koi.model.AuctionRequest;
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
    private final ModelMapper modelMapper;

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

    @PatchMapping("/breeder/cancel/{requestId}")
    public ResponseData<?> cancelRequest(@PathVariable Integer requestId){
        try{
            auctionRequestService.cancelRequest(requestId);
            return new ResponseData<>(ResponseCode.CANCEL_REQUEST_SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PutMapping("/breeder/update/{requestId}")
    public ResponseData<AuctionRequestResponseDTO> updateRequest(@PathVariable Integer requestId,
                                                               @RequestBody AuctionRequestUpdateDTO auctionRequest){
        try{
            AuctionRequestResponseDTO response = auctionRequestEntityToDtoConverter.convertAuctionRequest(auctionRequestService.updateRequest(requestId, auctionRequest));
           return new ResponseData<>(ResponseCode.UPDATE_REQUEST_SUCCESS, response);
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

    @PatchMapping("/staff/request/{requestId}/status")
    public ResponseData<?> changeStatus(@PathVariable Integer requestId, @RequestBody UpdateStatusDTO request){
        auctionRequestService.changeStatus(requestId, request);
        return new ResponseData<>(ResponseCode.AUCTION_STATUS_CHANGE);
    }

}


