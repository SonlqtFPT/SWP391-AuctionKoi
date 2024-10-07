package swp.koi.service.lotRegisterService;

import jakarta.servlet.http.HttpServletRequest;
import swp.koi.dto.request.LotRegisterDTO;
import swp.koi.dto.response.LotRegisterResponseDTO;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface LotRegisterService {
    String regisSlotWithLotId(LotRegisterDTO lotRegisterDTO, HttpServletRequest request) throws UnsupportedEncodingException;

    List<LotRegisterResponseDTO> listLotRegistersByLotId(int lotId);

}