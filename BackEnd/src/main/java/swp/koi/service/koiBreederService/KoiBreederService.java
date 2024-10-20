package swp.koi.service.koiBreederService;

import jakarta.validation.Valid;
import swp.koi.dto.request.KoiBreederDTO;
import swp.koi.dto.request.UpdateBreederProfileDto;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.model.Account;
import swp.koi.model.AuctionRequest;
import swp.koi.model.KoiBreeder;
import swp.koi.model.KoiFish;

import java.util.List;

public interface KoiBreederService {
    KoiBreederResponseDTO createKoiBreeder(KoiBreederDTO request);

    KoiBreeder findByAccount(Account account);

    KoiBreeder findByBreederId(Integer breederId);

    void updateBreederProfile(@Valid UpdateBreederProfileDto request);

    KoiBreeder getBreederInfo();
}
