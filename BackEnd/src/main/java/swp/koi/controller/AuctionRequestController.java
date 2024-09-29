package swp.koi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.AuctionRequestEntityToDtoConverter;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.request.FullAuctionRequestDTO;
import swp.koi.dto.response.AuctionRequestResponseDTO;
import swp.koi.dto.response.AuctionResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.AuctionRequest;
import swp.koi.model.KoiBreeder;
import swp.koi.service.auctionRequestService.AuctionRequestService;
import swp.koi.service.koiBreederService.KoiBreederService;

import java.util.List;

@RestController
@RequestMapping("/auctionRequest")
@RequiredArgsConstructor
public class AuctionRequestController {

    private final AuctionRequestService auctionRequestService;
    private final AuctionRequestEntityToDtoConverter auctionRequestEntityToDtoConverter;
    private final KoiBreederService koiBreederService;

    @PostMapping("/addRequest")
    public ResponseData<AuctionRequestResponseDTO> createRequest(@Valid @RequestBody AuctionRequestDTO request){
        try{
            AuctionRequestResponseDTO response = auctionRequestEntityToDtoConverter
                    .convertAuctionRequest(auctionRequestService.createRequest(request));
            return new ResponseData<>(ResponseCode.CREATED_SUCCESS, response);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

//    @GetMapping("/request/{breederId}")
//    public ResponseData<List<AuctionRequestResponseDTO>> getListRequest(@PathVariable Integer breederId){
//        List<AuctionRequestResponseDTO> reponse = auctionRequestEntityToDtoConverter.convertAuctionRequestList(auctionRequestService.getAllRequestById(breederId));
//        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST);
//    }

//    @PutMapping("/updateRequest/{requestId}")
//    public ResponseData<AuctionRequestResponseDTO> updateRequest(@Valid @RequestBody FullAuctionRequestDTO request, @PathVariable Integer requestId){
//        auctionRequestEntityToDtoConverter.convertAuctionRequest(auctionRequestService.updateRequest(request, requestId));
//        return new ResponseData<>(ResponseCode.AUCTION_REQUEST_NOT_FOUND);
//    }

}
