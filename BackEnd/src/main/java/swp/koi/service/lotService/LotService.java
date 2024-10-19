package swp.koi.service.lotService;

import swp.koi.model.Lot;
import java.util.List;

public interface LotService {

    Lot findLotById(int id);

    void startLotBy();

    void endLot(Lot lot);

    List<Lot> createLots(List<Lot> lots);
}
