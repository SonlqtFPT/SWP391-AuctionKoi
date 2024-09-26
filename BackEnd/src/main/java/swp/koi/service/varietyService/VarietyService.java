package swp.koi.service.varietyService;

import swp.koi.model.Variety;

public interface VarietyService {
    Variety findByVarietyName(String name);
}
