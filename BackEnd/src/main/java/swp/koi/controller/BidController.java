package swp.koi.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.koi.dto.response.requestDto.BidRequestDto;
import swp.koi.service.bidService.BidService;

@RestController
@RequestMapping("/bid")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping("/bidAuction")
    public ResponseEntity<?> bidLotWithId(@RequestBody BidRequestDto bidRequestDto){

            bidService.bid(bidRequestDto);

        return new ResponseEntity<>("Bid auction successful",HttpStatus.OK);

    }

    @GetMapping("/list")
    public ResponseEntity<?> listBidByLotId(@RequestParam int lotId){
        return new ResponseEntity<>(bidService.listBidByLotId(lotId),HttpStatus.OK);
    }
}
