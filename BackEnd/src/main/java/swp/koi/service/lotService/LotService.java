package swp.koi.service.lotService;

import swp.koi.model.Lot;

public interface LotService {
    Lot findLotById(int id);

    void startLotBy();

    void endLot(Lot lot);
}
