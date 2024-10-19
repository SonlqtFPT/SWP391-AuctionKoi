package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.LotRegisterResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.LotRegister;

@Component
@RequiredArgsConstructor
public class LotRegisterEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public LotRegisterResponseDTO convertLotRegister(LotRegister lotRegister){
        if(lotRegister == null)
            throw new KoiException(ResponseCode.FOUND_NOTHING);
        LotRegisterResponseDTO response = modelMapper.map(lotRegister, LotRegisterResponseDTO.class);
        return response;
    }

}
