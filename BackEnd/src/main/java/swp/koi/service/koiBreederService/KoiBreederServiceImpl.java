package swp.koi.service.koiBreederService;

import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.KoiBreeder;
import swp.koi.repository.KoiBreederRepository;

@Service
public class KoiBreederServiceImpl implements KoiBreederService{

    private final KoiBreederRepository koiBreederRepository;

    public KoiBreederServiceImpl(KoiBreederRepository koiBreederRepository) {
        this.koiBreederRepository = koiBreederRepository;
    }

    @Override
    public KoiBreeder findByBreederId(Integer breederId) {
        return koiBreederRepository.findByBreederId(breederId).orElseThrow(() -> new KoiException(ResponseCode.NOT_FOUND));
    }
}
