package swp.koi.controller;

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
public class AuctionController {

    private final AuctionService auctionService;
    private final KoiFishService koiFishService;
    private final KoiFishEntityToDtoConverter koiFishEntityToDtoConverter;
    private final AuctionRequestEntityToDtoConverter auctionRequestEntityToDtoConverter;
    private final AuctionRequestService auctionRequestService;
    private final KoiBreederService koiBreederService;
    private final AccountService accountService;

    @GetMapping("/manager/getFish")
    public ResponseData<?> getKoiFishFromApproveRequest(){
        List<KoiFishResponseDTO> response = koiFishEntityToDtoConverter
                .convertFishList(koiFishService.getKoiFishFromApproveRequest());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @PostMapping("/manager/get-fish-auction")
    public ResponseData<List<KoiFishResponseDTO>> getKoiFishBasedOnType(@RequestBody AuctionTypeDTO auctionTypeDTO){
        List<KoiFishResponseDTO> response = koiFishEntityToDtoConverter
                .convertFishList(koiFishService.getKoiFishBasedOnType(auctionTypeDTO));
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

    @PostMapping("/manager/createAuction")
    public ResponseData<?> createAuction(@Valid @RequestBody AuctionWithLotsDTO request){
        try{
            AuctionResponseDTO response = auctionService.createAuctionWithLots(request);
            return new ResponseData<>(ResponseCode.SUCCESS, response);
        }catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/manager/createBreeder")
    public ResponseData<KoiBreederResponseDTO> createKoiBreeder(@Valid @RequestBody KoiBreederDTO request){
        try{
            koiBreederService.createKoiBreeder(request);
            return new ResponseData<>(ResponseCode.CREATED_SUCCESS);
        } catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @PostMapping("/manager/createStaff")
    public ResponseData<?> createStaff(@RequestBody AccountRegisterDTO staffDto){
        accountService.createAccountStaff(staffDto);
        return new ResponseData<>(ResponseCode.CREATED_SUCCESS);
    }

}
