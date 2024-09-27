package swp.koi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.AuctionEntityToDtoConverter;
import swp.koi.convert.KoiFishEntityToDtoConverter;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.dto.response.AuctionResponseDTO;
import swp.koi.dto.response.KoiFishResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.Auction;
import swp.koi.service.auctionService.AuctionService;
import swp.koi.service.koiFishService.KoiFishService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;
    private final KoiFishService koiFishService;
    private final KoiFishEntityToDtoConverter koiFishEntityToDtoConverter;

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

}
