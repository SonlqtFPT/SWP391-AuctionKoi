package swp.koi.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.BidEntityToDtoConverter;
import swp.koi.dto.request.AutoBidRequestDTO;
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
@Tag(name = "bid", description = "Everything about your bid")
public class BidController {

    private final BidService bidService;
    private final BidEntityToDtoConverter bidEntityToDtoConverter;

    @Operation(summary = "Bid in lot")
    @PostMapping("/bidAuction")
    public ResponseData<?> bidLotWithId(@RequestBody BidRequestDto bidRequestDto){
        try{
            bidService.bid(bidRequestDto);
            return new ResponseData<>(ResponseCode.BID_SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Retrieve all bid in a lot")
    @GetMapping("/list")
    public ResponseData<List<BidResponseDTO>> listBidByLotId(@RequestParam int lotId){
        try {
            List<BidResponseDTO> response = bidEntityToDtoConverter.convertBidList(bidService.listBidByLotId(lotId));
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/active-auto-bid")
    public ResponseData<?> autoBidForLot(@RequestBody AutoBidRequestDTO autoBidRequestDTO){

        try {
            bidService.activeAutoBid(autoBidRequestDTO);

            return new ResponseData<>(ResponseCode.SUCCESS);
        } catch (KoiException e) {
            throw new RuntimeException(e);
        }
    }
}
