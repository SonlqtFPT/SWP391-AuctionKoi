package swp.koi.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.AccountEntityToDtoConverter;
import swp.koi.convert.AuctionRequestEntityToDtoConverter;
import swp.koi.dto.request.*;
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
    private final ModelMapper modelMapper;

    @PostMapping("/breeder/request/addRequest")
    public ResponseData<AuctionRequestResponseDTO> createRequest(@Valid @RequestBody AuctionRequestDTO request){
        try{
            AuctionRequestResponseDTO response = auctionRequestEntityToDtoConverter
                    .convertAuctionRequest(auctionRequestService.createRequest(request));
            return new ResponseData<>(ResponseCode.CREATED_SUCCESS, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @GetMapping("/breeder/request/{accountId}")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllBreederRequest(@PathVariable Integer accountId){
        try{
            List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllBreederRequest(accountId));
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PatchMapping("/breeder/request/cancel/{requestId}")
    public ResponseData<?> breederCancelRequest(@PathVariable Integer requestId){
        try{
            auctionRequestService.breederCancelRequest(requestId);
            return new ResponseData<>(ResponseCode.CANCEL_REQUEST_SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PutMapping("/breeder/request/update/{requestId}")
    public ResponseData<AuctionRequestResponseDTO> updateRequest(@PathVariable Integer requestId,
                                                               @RequestBody AuctionRequestUpdateDTO auctionRequestUpdateDTO){
        try{
            AuctionRequestResponseDTO response = auctionRequestEntityToDtoConverter.convertAuctionRequest(auctionRequestService.updateRequest(requestId, auctionRequestUpdateDTO));
           return new ResponseData<>(ResponseCode.UPDATE_REQUEST_SUCCESS, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/breeder/request/negotiation/accept/{requestId}")
    public ResponseData<?> acceptNegotiation(@PathVariable Integer requestId){
        try{
            auctionRequestService.acceptNegotiation(requestId);
            return new ResponseData<>(ResponseCode.SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/breeder/request/negotiation/send-negotiation/{requestId}")
    public ResponseData<?> sendReNegotiation(@PathVariable Integer requestId, @RequestBody KoiFishNegotiationDTO koiFishNegotiationDTO){
        try{
            auctionRequestService.sendReNegotiation(requestId, koiFishNegotiationDTO);
            return new ResponseData<>(ResponseCode.SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @GetMapping("/breeder/request/get-request/pending")
    public ResponseData<?> getAllPendingRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllPendingRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }
    @GetMapping("/breeder/request/get-request/inspection-pending")
    public ResponseData<?> getAllInspectionPendingRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllInspectionPendingRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }
    @GetMapping("/breeder/request/get-request/inspection-passed")
    public ResponseData<?> getAllInspectionPassedRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllInspectionPassedRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }
    @GetMapping("/breeder/request/get-request/inspection-failed")
    public ResponseData<?> getAllInspectionFailedRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllInspectionFailedRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }
    @GetMapping("/breeder/request/get-request/negotiating")
    public ResponseData<?> getAllNegotiatingRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllNegotiatingRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }
    @GetMapping("/breeder/request/get-request/approved")
    public ResponseData<?> getAllApprovedRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllApprovedRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }
    @GetMapping("/breeder/request/get-request/rejected")
    public ResponseData<?> getAllRejectedRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllRejectedRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }
    @GetMapping("/breeder/request/get-request/cancelled")
    public ResponseData<?> getAllCancelledRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllCancelledRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @GetMapping("/manager/request/getRequest")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllAuctionRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllAuctionRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @GetMapping("/manager/request/assign-staff/getStaff")
    public ResponseData<List<AccountResponseDTO>> getAllStaff(){
        List<AccountResponseDTO> response = accountEntityToDtoConverter.convertAccountList(accountService.getAllStaff());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @PostMapping("/manager/request/assign-staff/{requestId}")
    public ResponseData<?> assignStaffToCheck(@PathVariable Integer requestId,
                                              @RequestParam Integer accountId){
        try{
            auctionRequestService.assignStaffToRequest(requestId, accountId);
            return new ResponseData<>(ResponseCode.STAFF_ASSIGN_SUCCESSFULLY);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PatchMapping("/manager/request/accept/{requestId}")
    public ResponseData<?> managerAcceptRequest(@PathVariable Integer requestId){
        auctionRequestService.managerAcceptRequest(requestId);
        return new ResponseData<>(ResponseCode.AUCTION_STATUS_CHANGE);
    }

    @PostMapping("/manager/request/negotiation/{requestId}")
    public ResponseData<?> managerNegotiation(@PathVariable Integer requestId, @RequestBody AuctionRequestNegotiationManagerDTO request){
        try{
            auctionRequestService.managerNegotiation(requestId, request);
            return new ResponseData<>(ResponseCode.SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/manager/request/negotiation/accept/{requestId}")
    public ResponseData<?> managerAcceptNegotiation(@PathVariable Integer requestId){
        try {
            auctionRequestService.managerAcceptNegotiation(requestId);
            return new ResponseData<>(ResponseCode.SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/manager/request/cancel/{requestId}")
    public ResponseData<?> managerCancelRequest(@PathVariable Integer requestId){
        try{
            auctionRequestService.managerCancelRequest(requestId);
            return new ResponseData<>(ResponseCode.SUCCESS);
        } catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @GetMapping("/staff/list-request/{accountId}")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllStaffRequest(@PathVariable Integer accountId){
        try{
            List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllStaffRequest(accountId));
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

    @GetMapping("/request/get/{requestId}")
    public ResponseData<AuctionRequestResponseDTO> getRequestDetail(@PathVariable Integer requestId){
        try{
            AuctionRequestResponseDTO response = auctionRequestEntityToDtoConverter.convertAuctionRequest(auctionRequestService.getRequestDetail(requestId));
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

}


