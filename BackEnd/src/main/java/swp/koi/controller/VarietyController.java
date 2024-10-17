package swp.koi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.convert.VarietyEntityToDtoConverter;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.dto.response.VarietyResponseDTO;
import swp.koi.model.Variety;
import swp.koi.service.varietyService.VarietyService;

import java.util.List;

@RestController
@RequestMapping("/variety")
@RequiredArgsConstructor
public class VarietyController {

    private final VarietyService varietyService;
    private final VarietyEntityToDtoConverter varietyEntityToDtoConverter;

    @GetMapping("/get-all-variety")
    public ResponseData<List<VarietyResponseDTO>> getAllVariety(){
        List<VarietyResponseDTO> response = varietyEntityToDtoConverter.convertVarietyList(varietyService.getAllVariety());
        return new ResponseData<>(ResponseCode.SUCCESS_GET_LIST, response);
    }

}
