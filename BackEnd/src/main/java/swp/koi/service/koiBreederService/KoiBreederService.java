package swp.koi.service.koiBreederService;

import swp.koi.dto.request.KoiBreederDTO;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.model.KoiBreeder;

public interface KoiBreederService {
    KoiBreeder findByBreederId(Integer breederId);

    KoiBreederResponseDTO createKoiBreeder(KoiBreederDTO request);
}
