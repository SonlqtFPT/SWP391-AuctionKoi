package swp.koi.service.lotService;

import org.springframework.scheduling.annotation.Async;
import swp.koi.model.Invoice;
import swp.koi.model.Lot;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface LotService {

    Lot findLotById(int id);

    void startLotBy();
    
    void endLot(Lot lot);

    List<Lot> createLots(List<Lot> lots);

    Invoice generateInvoice(int lotId, int memberId) throws UnsupportedEncodingException;

    @Async
    void sendNotificateToFollower(Lot lot);

    List<Lot> getLotByMember(Integer memberId);
}
