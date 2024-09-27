package swp.koi.service.lotRegisterService;

import swp.koi.dto.request.LotRegisterDTO;
import swp.koi.dto.response.LotRegisterResponseDTO;

import java.util.List;

public interface LotRegisterService {
    void regisSlotWithLotId(LotRegisterDTO lotRegisterDTO);

    List<LotRegisterResponseDTO> listLotRegistersByLotId(int lotId);

}
