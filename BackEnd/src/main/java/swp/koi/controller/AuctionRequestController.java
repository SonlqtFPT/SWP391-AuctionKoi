package swp.koi.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.model.AuctionRequest;
import swp.koi.service.auctionRequestService.AuctionRequestService;
import swp.koi.service.auctionRequestService.AuctionRequestServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AuctionRequestController {

    private final AuctionRequestService auctionRequestService;

    public AuctionRequestController(AuctionRequestServiceImpl auctionRequestService) {
        this.auctionRequestService = auctionRequestService;
    }

    @PostMapping("/addRequest")
    public ResponseData<String> createRequest(@Valid @RequestBody AuctionRequestDTO request){
        auctionRequestService.createRequest(request);
        return new ResponseData<>(ResponseCode.SUCCESS);
    }

    @GetMapping("/getRequest")
    public ResponseData<List<AuctionRequest>> getAllAuctionRequest(){
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, auctionRequestService.getAllAuctionRequest());
    }


}
