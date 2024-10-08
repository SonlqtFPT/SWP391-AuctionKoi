package swp.koi.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.BidEntityToDtoConverter;
import swp.koi.dto.request.BidRequestDto;
import swp.koi.dto.response.BidResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.service.bidService.BidService;

import java.util.List;

@RestController
@RequestMapping("/bid")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;
    private final BidEntityToDtoConverter bidEntityToDtoConverter;

    @PostMapping("/bidAuction")
    public ResponseData<?> bidLotWithId(@RequestBody BidRequestDto bidRequestDto){
        try{
            bidService.bid(bidRequestDto);
            return new ResponseData<>(ResponseCode.BID_SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @GetMapping("/list")
    public ResponseData<List<BidResponseDTO>> listBidByLotId(@RequestParam int lotId){
        try {
            List<BidResponseDTO> response = bidEntityToDtoConverter.convertBidList(bidService.listBidByLotId(lotId));
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }
}
