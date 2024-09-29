package swp.koi.service.koiBreederService;

import swp.koi.dto.request.KoiBreederDTO;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.model.Account;
import swp.koi.model.AuctionRequest;
import swp.koi.model.KoiBreeder;

import java.util.List;

public interface KoiBreederService {
    KoiBreederResponseDTO createKoiBreeder(KoiBreederDTO request);

    KoiBreeder findByAccount(Account account);

}
