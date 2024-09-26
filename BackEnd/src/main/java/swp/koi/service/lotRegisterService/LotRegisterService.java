package swp.koi.service.lotRegisterService;

import swp.koi.dto.response.requestDto.LotRegisDto;
import swp.koi.model.LotRegister;

import java.util.List;

public interface LotRegisterService {
    void regisSlotWithLotId(LotRegisDto lotRegisDto);

    List<LotRegister> listLotRegistersByLotId(int lotId);

}
