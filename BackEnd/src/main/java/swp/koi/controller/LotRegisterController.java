package swp.koi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import swp.koi.dto.request.LotRegisterDTO;

import swp.koi.dto.response.LotRegisterResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.service.lotRegisterService.LotRegisterService;


import java.util.List;

@RestController
@RequestMapping("/register-lot")
@RequiredArgsConstructor
public class LotRegisterController {

    private final LotRegisterService lotRegisterService;

    @PostMapping("/regis")
    public ResponseData<String> registerLot(@RequestBody LotRegisterDTO lotRegisterDTO) {
        try{
            lotRegisterService.regisSlotWithLotId(lotRegisterDTO);
            return new ResponseData<>(ResponseCode.LOT_REGISTER_SUCCESS);
        }catch (KoiException e){
            return new ResponseData<>(e.getResponseCode());
        }
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

}
