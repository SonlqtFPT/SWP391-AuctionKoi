package swp.koi.service.lotService;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.model.Lot;
import swp.koi.repository.LotRepository;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final LotService lotService;
    private final LotRepository lotRepository;

    @GetMapping("/send-msg")
    public void sendMsg(@RequestParam int lotId) {

        Optional<Lot> lot = lotRepository.findById(lotId);

        lotService.sendNotificateToFollower(lot.get());
    }

}
