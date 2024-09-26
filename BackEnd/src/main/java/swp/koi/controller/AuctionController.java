package swp.koi.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.model.Auction;
import swp.koi.service.auctionService.AuctionService;
import swp.koi.service.koiFishService.KoiFishService;

@RestController
@RequestMapping("/api/v1")
public class AuctionController {

    private final AuctionService auctionService;
    private final KoiFishService koiFishService;

    public AuctionController(AuctionService auctionService, KoiFishService koiFishService) {
        this.auctionService = auctionService;
        this.koiFishService = koiFishService;
    }

    @GetMapping("/createAuction")
    public ResponseData<?> getKoiFishFromApproveRequest(){
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, koiFishService.getKoiFishFromApproveRequest());
    }

    @PostMapping("/createAuction")
    public ResponseData<?> createAuction(@Valid @RequestBody AuctionWithLotsDTO request){
        Auction auction = auctionService.createAuctionWithLots(request);
        return new ResponseData<>(ResponseCode.SUCCESS, auction);
    }

}
