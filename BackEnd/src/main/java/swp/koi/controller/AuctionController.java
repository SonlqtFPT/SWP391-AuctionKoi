package swp.koi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.AuctionEntityToDtoConverter;
import swp.koi.convert.AuctionRequestEntityToDtoConverter;
import swp.koi.convert.KoiFishEntityToDtoConverter;
import swp.koi.dto.request.*;
import swp.koi.dto.response.*;
import swp.koi.exception.KoiException;
import swp.koi.model.Auction;
import swp.koi.model.KoiBreeder;
import swp.koi.service.accountService.AccountService;
import swp.koi.service.auctionRequestService.AuctionRequestService;
import swp.koi.service.auctionService.AuctionService;
import swp.koi.service.koiBreederService.KoiBreederService;
import swp.koi.service.koiFishService.KoiFishService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "auction", description = "Everything about your auction")
public class AuctionController {

    private final AuctionService auctionService;
    private final KoiFishService koiFishService;
    private final KoiFishEntityToDtoConverter koiFishEntityToDtoConverter;
    private final AuctionRequestEntityToDtoConverter auctionRequestEntityToDtoConverter;
    private final AuctionEntityToDtoConverter auctionEntityToDtoConverter;
    private final AuctionRequestService auctionRequestService;
    private final KoiBreederService koiBreederService;
    private final AccountService accountService;

    @Operation(summary = "Retrieve all fish")
    @GetMapping("/manager/getFish")
    public ResponseData<?> getKoiFishFromApproveRequest(){
        List<KoiFishResponseDTO> response = koiFishEntityToDtoConverter
                .convertFishList(koiFishService.getKoiFishFromApproveRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve all fish that have same auction type with auction's auction type")
    @PostMapping("/manager/get-fish-auction")
    public ResponseData<List<KoiFishResponseDTO>> getKoiFishBasedOnType(@RequestBody AuctionTypeDTO auctionTypeDTO){
        List<KoiFishResponseDTO> response = koiFishEntityToDtoConverter
                .convertFishList(koiFishService.getKoiFishBasedOnType(auctionTypeDTO));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Create a auction")
    @PostMapping("/manager/createAuction")
    public ResponseData<?> createAuction(@Valid @RequestBody AuctionWithLotsDTO request){
        try{
            AuctionResponseDTO response = auctionService.createAuctionWithLots(request);
            return new ResponseData<>(ResponseCode.SUCCESS, response);
        }catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Create breeder account")
    @PostMapping("/manager/createBreeder")
    public ResponseData<KoiBreederResponseDTO> createKoiBreeder(@Valid @RequestBody KoiBreederDTO request){
        try{
            koiBreederService.createKoiBreeder(request);
            return new ResponseData<>(ResponseCode.CREATED_SUCCESS);
        } catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @Operation(summary = "Create staff account")
    @PostMapping("/manager/createStaff")
    public ResponseData<?> createStaff(@RequestBody AccountRegisterDTO staffDto){
        accountService.createAccountStaff(staffDto);
        return new ResponseData<>(ResponseCode.CREATED_SUCCESS);
    }

    @Operation(summary = "Retrieve all auction")
    @GetMapping("/auction/get-all-auction")
    public ResponseData<List<AuctionResponseDTO>> getAllAuction(){
        List<AuctionResponseDTO> response = auctionEntityToDtoConverter.converAuctiontList(auctionService.getAllAuction());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve details of an auction")
    @GetMapping("/auction/get-auction/{auctionId}")
    public ResponseData<AuctionResponseDTO> getAuction(@PathVariable Integer auctionId){
        AuctionResponseDTO response = auctionEntityToDtoConverter.convertAuction(auctionService.getAuction(auctionId));
        return new ResponseData<>(ResponseCode.SUCCESS, response);
    }

    @Operation(summary = "Retrieve details of a lot")
    @GetMapping("/auction/get-lot/{lotId}")
    public ResponseData<LotResponseDto> getLot(@PathVariable Integer lotId){
        return new ResponseData<>(ResponseCode.SUCCESS, auctionService.getLot(lotId));
    }

    @Operation(summary = "Retrieve auctioning")
    @GetMapping("/auction/get-auction/auctioning")
    public ResponseData<List<AuctionResponseDTO>> getAllOnGoingAuction(){
        List<AuctionResponseDTO> response = auctionEntityToDtoConverter.converAuctiontList(auctionService.getAllOnGoingAuction());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @Operation(summary = "Retrieve completed auction")
    @GetMapping("/auction/get-auction/completed")
    public ResponseData<List<AuctionResponseDTO>> getAllCompletedAuction(){
        List<AuctionResponseDTO> response = auctionEntityToDtoConverter.converAuctiontList(auctionService.getAllCompletedAuction());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

}
