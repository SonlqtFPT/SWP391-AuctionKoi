package swp.koi.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.koi.dto.request.LotRegisterDTO;

import swp.koi.dto.response.LotRegisterResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.service.lotRegisterService.LotRegisterService;


import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/register-lot")
@RequiredArgsConstructor
public class LotRegisterController {

    private final LotRegisterService lotRegisterService;

    @PostMapping("/regis")
    public ResponseEntity<?> registerLot(@RequestBody LotRegisterDTO lotRegisterDTO, HttpServletRequest request) throws KoiException {
        try{
            var userRegisted = lotRegisterService.regisSlotWithLotId(lotRegisterDTO,request);
            if(userRegisted != null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(userRegisted);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("User already registered to lot");
        }catch (KoiException | UnsupportedEncodingException e){
            throw new RuntimeException(e);
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
