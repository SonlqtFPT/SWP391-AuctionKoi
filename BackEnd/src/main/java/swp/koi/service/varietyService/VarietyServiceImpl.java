package swp.koi.service.varietyService;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Variety;
import swp.koi.repository.VarietyRepository;

@Service
@Transactional
public class VarietyServiceImpl implements VarietyService{

    private final VarietyRepository varietyRepository;

    public VarietyServiceImpl(VarietyRepository varietyRepository) {
        this.varietyRepository = varietyRepository;
    }

    @Override
    public Variety findByVarietyName(String name) {
        return varietyRepository.findByVarietyName(name).orElseThrow(() -> new KoiException(ResponseCode.NOT_FOUND));
    }
}
