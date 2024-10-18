package swp.koi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "request", description = "Everything about your request")
public class AuctionRequestController {

    private final AuctionRequestService auctionRequestService;
    private final AuctionRequestEntityToDtoConverter auctionRequestEntityToDtoConverter;
    private final KoiBreederService koiBreederService;
    private final AccountEntityToDtoConverter accountEntityToDtoConverter;
    private final AccountService accountService;
    private final ModelMapper modelMapper;

    @Operation(summary = "Add a new request")
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

    @Operation(summary = "Retrieve all request of a breeder", description = "Retrieve all request of a breeder by accountId")
    @GetMapping("/breeder/request/{accountId}")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllBreederRequest(@PathVariable Integer accountId){
        try{
            List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllBreederRequest(accountId));
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Cancel a request")
    @PatchMapping("/breeder/request/cancel/{requestId}")
    public ResponseData<?> breederCancelRequest(@PathVariable Integer requestId){
        try{
            auctionRequestService.breederCancelRequest(requestId);
            return new ResponseData<>(ResponseCode.CANCEL_REQUEST_SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Update a request information", description = "Update request information by request id")
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

    @Operation(summary = "Accept manager's negotiation")
    @PostMapping("/breeder/request/negotiation/accept/{requestId}")
    public ResponseData<?> acceptNegotiation(@PathVariable Integer requestId){
        try{
            auctionRequestService.acceptNegotiation(requestId);
            return new ResponseData<>(ResponseCode.SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Send negotiation to manager")
    @PostMapping("/breeder/request/negotiation/send-negotiation/{requestId}")
    public ResponseData<?> sendReNegotiation(@PathVariable Integer requestId, @RequestBody KoiFishNegotiationDTO koiFishNegotiationDTO){
        try{
            auctionRequestService.sendReNegotiation(requestId, koiFishNegotiationDTO);
            return new ResponseData<>(ResponseCode.SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Retrieve all pending request")
    @GetMapping("/breeder/request/get-request/pending/{accountId}")
    public ResponseData<?> getAllPendingRequest(@PathVariable Integer accountId){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllPendingRequest(accountId));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all inspection pending request")
    @GetMapping("/breeder/request/get-request/inspection-pending/{accountId}")
    public ResponseData<?> getAllInspectionPendingRequest(@PathVariable Integer accountId){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllInspectionPendingRequest(accountId));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all inspection passed request")
    @GetMapping("/breeder/request/get-request/inspection-passed/{accountId}")
    public ResponseData<?> getAllInspectionPassedRequest(@PathVariable Integer accountId){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllInspectionPassedRequest(accountId));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all inspection failed request")
    @GetMapping("/breeder/request/get-request/inspection-failed/{accountId}")
    public ResponseData<?> getAllInspectionFailedRequest(@PathVariable Integer accountId){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllInspectionFailedRequest(accountId));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all negotiating request")
    @GetMapping("/breeder/request/get-request/negotiating/{accountId}")
    public ResponseData<?> getAllNegotiatingRequest(@PathVariable Integer accountId){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllNegotiatingRequest(accountId));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all approved request")
    @GetMapping("/breeder/request/get-request/approved/{accountId}")
    public ResponseData<?> getAllApprovedRequest(@PathVariable Integer accountId){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllApprovedRequest(accountId));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all rejected request")
    @GetMapping("/breeder/request/get-request/rejected/{accountId}")
    public ResponseData<?> getAllRejectedRequest(@PathVariable Integer accountId){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllRejectedRequest(accountId));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all cancelled request")
    @GetMapping("/breeder/request/get-request/cancelled/{accountId}")
    public ResponseData<?> getAllCancelledRequest(@PathVariable Integer accountId){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllCancelledRequest(accountId));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all request for manager")
    @GetMapping("/manager/request/getRequest")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllAuctionRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllAuctionRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all staff to assign a request")
    @GetMapping("/manager/request/assign-staff/getStaff")
    public ResponseData<List<AccountResponseDTO>> getAllStaff(){
        List<AccountResponseDTO> response = accountEntityToDtoConverter.convertAccountList(accountService.getAllStaff());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Assign a staff to a request")
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

    @Operation(summary = "Accept breeder's request")
    @PatchMapping("/manager/request/accept/{requestId}")
    public ResponseData<?> managerAcceptRequest(@PathVariable Integer requestId){
        auctionRequestService.managerAcceptRequest(requestId);
        return new ResponseData<>(ResponseCode.AUCTION_STATUS_CHANGE);
    }

    @Operation(summary = "Send negotiation to breeder")
    @PostMapping("/manager/request/negotiation/{requestId}")
    public ResponseData<?> managerNegotiation(@PathVariable Integer requestId, @RequestBody AuctionRequestNegotiationManagerDTO request){
        try{
            auctionRequestService.managerNegotiation(requestId, request);
            return new ResponseData<>(ResponseCode.SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Accept breeder's negotiation")
    @PostMapping("/manager/request/negotiation/accept/{requestId}")
    public ResponseData<?> managerAcceptNegotiation(@PathVariable Integer requestId){
        try {
            auctionRequestService.managerAcceptNegotiation(requestId);
            return new ResponseData<>(ResponseCode.SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Cancel breeder's request")
    @PostMapping("/manager/request/cancel/{requestId}")
    public ResponseData<?> managerCancelRequest(@PathVariable Integer requestId){
        try{
            auctionRequestService.managerCancelRequest(requestId);
            return new ResponseData<>(ResponseCode.SUCCESS);
        } catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Retrieve all request that sent to staff")
    @GetMapping("/staff/list-request/{accountId}")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllStaffRequest(@PathVariable Integer accountId){
        try{
            List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllStaffRequest(accountId));
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Update status for request")
    @PatchMapping("/staff/request/{requestId}/status")
    public ResponseData<?> changeStatus(@PathVariable Integer requestId, @RequestBody UpdateStatusDTO request){
        auctionRequestService.changeStatus(requestId, request);
        return new ResponseData<>(ResponseCode.AUCTION_STATUS_CHANGE);
    }

    @Operation(summary = "Retrieve request's details")
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


