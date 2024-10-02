package swp.koi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.dto.request.KoiBreederDTO;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.KoiBreeder;
import swp.koi.service.koiBreederService.KoiBreederService;

@RestController
@RequiredArgsConstructor
public class KoiBreederController {

    private final KoiBreederService koiBreederService;

    @PostMapping("/manager/createBreeder")
    public ResponseData<KoiBreederResponseDTO> createKoiBreeder(@Valid @RequestBody KoiBreederDTO request){
        try{
            koiBreederService.createKoiBreeder(request);
            return new ResponseData<>(ResponseCode.CREATED_SUCCESS);
        } catch (KoiException e) {
            return new ResponseData<>(e.getResponseCode());
        }
    }

}
