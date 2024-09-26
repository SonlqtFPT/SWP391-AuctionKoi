package swp.koi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.koi.dto.response.requestDto.LotRegisDto;

import swp.koi.model.LotRegister;
import swp.koi.service.lotRegisterService.LotRegisterService;


import java.util.List;

@RestController
@RequestMapping("/register-lot")
@RequiredArgsConstructor
public class LotRegisterController {

    private final LotRegisterService lotRegisterService;

    @PostMapping("/regis")
    public ResponseEntity<?> registerLot(@RequestBody LotRegisDto lotRegisDto) {

        lotRegisterService.regisSlotWithLotId(lotRegisDto);

        return new ResponseEntity<>("Regis for lot successful",HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<LotRegister>> listRegisterLotById(@RequestParam int lotId) {

        List<LotRegister> lotRegisterList = lotRegisterService.listLotRegistersByLotId(lotId);

        return new ResponseEntity<>(lotRegisterList, HttpStatus.OK);
    }

}
