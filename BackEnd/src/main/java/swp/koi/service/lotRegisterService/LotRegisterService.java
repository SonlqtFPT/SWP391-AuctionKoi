package swp.koi.service.lotRegisterService;

import swp.koi.controller.AuctionController;
import swp.koi.dto.request.LotRegisterDTO;
import swp.koi.dto.response.LotRegisterResponseDTO;
import swp.koi.exception.KoiException;
import swp.koi.model.Lot;
import swp.koi.model.LotRegister;
import swp.koi.model.Member;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface LotRegisterService {
    String regisSlotWithLotId(LotRegisterDTO lotRegisterDTO) throws UnsupportedEncodingException, KoiException;

    List<LotRegisterResponseDTO> listLotRegistersByLotId(int lotId);

    LotRegister getLotWinner(Integer lotId);

    boolean isRegistered(Integer lotId, Integer accountId);
}
