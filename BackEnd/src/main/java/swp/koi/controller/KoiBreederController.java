package swp.koi.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.web.bind.annotation.*;
import swp.koi.convert.KoiBreederEntityToDtoConverter;
import swp.koi.dto.request.KoiBreederDTO;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.KoiBreeder;
import swp.koi.service.koiBreederService.KoiBreederService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/breeder")
@Tag(name = "breeder", description = "Everything about your breeder")
public class KoiBreederController {

    private final KoiBreederService koiBreederService;
    private final KoiBreederEntityToDtoConverter koiBreederEntityToDtoConverter;

    @GetMapping("/get-breeder-information")
    public ResponseData<KoiBreederResponseDTO> getBreederInfo(){
        KoiBreederResponseDTO response = koiBreederEntityToDtoConverter.convertBreeder(koiBreederService.getBreederInfo());
        return new ResponseData<>(ResponseCode.SUCCESS, response);
    }

}
