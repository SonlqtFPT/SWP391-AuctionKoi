package swp.koi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.AuctionEntityToDtoConverter;
import swp.koi.convert.AuctionRequestEntityToDtoConverter;
import swp.koi.convert.KoiFishEntityToDtoConverter;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.dto.request.UpdateStatusDTO;
import swp.koi.dto.response.*;
import swp.koi.exception.KoiException;
import swp.koi.model.Auction;
import swp.koi.service.auctionRequestService.AuctionRequestService;
import swp.koi.service.auctionService.AuctionService;
import swp.koi.service.koiFishService.KoiFishService;

import java.util.List;

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;
    private final KoiFishService koiFishService;
    private final KoiFishEntityToDtoConverter koiFishEntityToDtoConverter;
    private final AuctionRequestEntityToDtoConverter auctionRequestEntityToDtoConverter;
    private final AuctionRequestService auctionRequestService;

    @GetMapping("/auction")
    public ResponseData<?> getKoiFishFromApproveRequest(){
        List<KoiFishResponseDTO> response = koiFishEntityToDtoConverter
                .convertFishList(koiFishService.getKoiFishFromApproveRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @PostMapping("/createAuction")
    public ResponseData<?> createAuction(@Valid @RequestBody AuctionWithLotsDTO request){
        try{
            AuctionResponseDTO response = auctionService.createAuctionWithLots(request);
            return new ResponseData<>(ResponseCode.SUCCESS, response);
        }catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PatchMapping("/request/{requestId}/status")
    public ResponseData<?> changeStatus(@PathVariable Integer requestId, @RequestBody UpdateStatusDTO request){
        auctionService.changeStatus(requestId, request);
        return new ResponseData<>(ResponseCode.AUCTION_STATUS_CHANGE);
    }

    @GetMapping("/getRequest")
    public ResponseData<List<AuctionRequestResponseDTO>> getAllAuctionRequest(){
        List<AuctionRequestResponseDTO> response = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllAuctionRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

}
