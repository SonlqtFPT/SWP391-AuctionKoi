package swp.koi.service.lotService;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.AuctionStatusEnum;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.model.enums.LotStatusEnum;
import swp.koi.repository.*;
import swp.koi.service.bidService.BidServiceImpl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LotServiceImpl implements LotService{

    private final LotRepository lotRepository;
    private final BidServiceImpl bidService;
    private final LotRegisterRepository lotRegisterRepository;
    private final KoiFishRepository koiFishRepository;
    private final AuctionRepository auctionRepository;

    @Override
    public Lot findLotById(int id) {
        return lotRepository.findById(id).orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));
    }

    @Override
    @Scheduled(fixedRate = 1000 * 60) //60s
    public void startLotBy() {
        //get time at the moment for use
        LocalDateTime now = LocalDateTime.now();

        //get list of lot that have time less than atm => start time < now -> start lot
        List<Lot> waitingLot = lotRepository.findAllByStatusAndStartingTimeLessThan(LotStatusEnum.WAITING,now);

        //change status to auctioning
        for (Lot lot : waitingLot) {
            KoiFish koiFish = lot.getKoiFish();
            koiFish.setStatus(KoiFishStatusEnum.AUCTIONING);
            koiFishRepository.save(koiFish);

            Auction auction = lot.getAuction();
            auction.setStatus(AuctionStatusEnum.AUCTIONING);
            auctionRepository.save(auction);

            lot.setStatus(LotStatusEnum.AUCTIONING);
            lotRepository.save(lot);
        }

        //get list of lot that have time less than atm
        // => end time < now
        // ==> start lot
        List<Lot> runningLot = lotRepository.findAllByStatusAndEndingTimeLessThan(LotStatusEnum.AUCTIONING,now);

        //end lot
        for (Lot lot : runningLot) {
            endLot(lot);
            System.out.println(lot);
        }
    }


    @Override
    public void endLot(Lot lot) {

        List<Bid> bidList = bidService.listBidByLotId(lot.getLotId());
        KoiFish koiFish = lot.getKoiFish();
        Auction auction = lot.getAuction();
        //if nobody bid
        // => change status to passed
        if(bidList.isEmpty()){
            lot.setStatus(LotStatusEnum.PASSED);
            lotRepository.save(lot);

            if (koiFish != null) {
                koiFish.setStatus(KoiFishStatusEnum.WAITING);
                koiFishRepository.save(koiFish);
            }

            if(auction != null){
                auction.setStatus(AuctionStatusEnum.COMPLETED);
                auctionRepository.save(auction);
            }
        } else {
            //find the biggest amount bidder
            Bid highestBid = bidList.stream().max(Comparator.comparing(Bid::getBidAmount))
                    .orElse(null);

            koiFish.setStatus(KoiFishStatusEnum.SOLD);
            lot.setStatus(LotStatusEnum.SOLD);
            auction.setStatus(AuctionStatusEnum.COMPLETED);
            //find lot register of this member
            LotRegister lotRegister = lotRegisterRepository.findLotRegisterByLotAndMember(lot, highestBid.getMember());

            lotRegister.setStatus(LotRegisterStatusEnum.WON);

            lotRegisterRepository.save(lotRegister);
            lotRepository.save(lot);
            koiFishRepository.save(koiFish);
            auctionRepository.save(auction);

            List<LotRegister> lotRegisterList = lotRegisterRepository.findByLot(lot).get();

            //change status of others to lose
            lotRegisterList
                    .stream()
                    .filter(lr -> !lr.getMember().equals(highestBid.getMember()))
                    .forEach( lr -> {
                        lr.setStatus(LotRegisterStatusEnum.LOSE);
                        lotRegisterRepository.save(lr);
                    });
        }

    }
    public List<Lot> createLots(List<Lot> lots) {
        return lotRepository.saveAll(lots);
    }

}
