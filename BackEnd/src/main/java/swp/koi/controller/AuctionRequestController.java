package swp.koi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.response.AuctionRequestResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.AuctionRequest;
import swp.koi.service.auctionRequestService.AuctionRequestService;
import swp.koi.service.auctionRequestService.AuctionRequestServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuctionRequestController {

    private final AuctionRequestService auctionRequestService;

    @PostMapping("/addRequest")
    public ResponseData<AuctionRequestResponseDTO> createRequest(@Valid @RequestBody AuctionRequestDTO request){
        try{
            auctionRequestService.createRequest(request);
            return new ResponseData<>(ResponseCode.CREATED_SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }

    }

    @GetMapping("/getRequest")
    public ResponseData<List<AuctionRequest>> getAllAuctionRequest(){
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, auctionRequestService.getAllAuctionRequest());
    }


}
