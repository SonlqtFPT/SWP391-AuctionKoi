package swp.koi.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import okhttp3.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.LotEntityToDtoConverter;
import swp.koi.convert.LotRegisterEntityToDtoConverter;
import swp.koi.dto.request.LotRegisterDTO;

import swp.koi.dto.response.LotRegisterResponseDTO;
import swp.koi.dto.response.LotResponseDto;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.LotRegister;
import swp.koi.service.lotRegisterService.LotRegisterService;


import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/register-lot")
@RequiredArgsConstructor
public class LotRegisterController {

    private final LotRegisterService lotRegisterService;
    private final LotRegisterEntityToDtoConverter lotRegisterEntityToDtoConverter;
    private final LotEntityToDtoConverter lotEntityToDtoConverter;

    @PostMapping("/regis")
    public ResponseData<?> registerLot(@RequestBody LotRegisterDTO lotRegisterDTO) {
        try{
            var paymentLink = lotRegisterService.regisSlotWithLotId(lotRegisterDTO);
            if(paymentLink != null) {
                return new ResponseData<>(ResponseCode.SUCCESS, paymentLink);
            }
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }catch (UnsupportedEncodingException ex){
            return new ResponseData<>(ResponseCode.FAIL);
        }
        return null;
    }

    @GetMapping("/list")
    public ResponseData<List<LotRegisterResponseDTO>> listRegisterLotById(@RequestParam int lotId) {
        try{
            List<LotRegisterResponseDTO> lotRegisterList = lotRegisterService.listLotRegistersByLotId(lotId);
            return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, lotRegisterList);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }

    @GetMapping("/get-winner")
    public ResponseData<?> getLotWinner(@RequestParam Integer lotId){
        LotRegisterResponseDTO response = lotRegisterEntityToDtoConverter.convertLotRegister(lotRegisterService.getLotWinner(lotId));
        return new ResponseData<>(ResponseCode.SUCCESS, response);
    }

    @GetMapping("/is-registered/{lotId}/{memberId}")
    public ResponseData<?> isRegistered(@PathVariable Integer lotId, @PathVariable Integer memberId){
        try{
            boolean isRegistered = lotRegisterService.isRegistered(lotId, memberId);
            if(isRegistered){
                return new ResponseData<>(ResponseCode.MEMBER_REGISTED);
            }else {
                return new ResponseData<>(ResponseCode.MEMBER_NOT_REGISTERED_FOR_LOT);
            }
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
    }
}


