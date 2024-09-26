package swp.koi.service.auctionService;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.dto.request.LotDTO;
import swp.koi.model.Auction;
import swp.koi.model.AuctionType;
import swp.koi.model.Lot;
import swp.koi.model.enums.AuctionStatusEnum;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.model.enums.LotStatusEnum;
import swp.koi.repository.AuctionRepository;
import swp.koi.repository.LotRepository;
import swp.koi.service.auctionTypeService.AuctionTypeService;
import swp.koi.service.koiFishService.KoiFishService;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AuctionServiceImpl implements AuctionService{

    private final AuctionRepository auctionRepository;
    private final AuctionTypeService auctionTypeService;
    private final KoiFishService koiFishService;
    private final LotRepository lotRepository;

    public AuctionServiceImpl(AuctionRepository auctionRepository, AuctionTypeService auctionTypeService, KoiFishService koiFishService, LotRepository lotRepository) {
        this.auctionRepository = auctionRepository;
        this.auctionTypeService = auctionTypeService;
        this.koiFishService = koiFishService;
        this.lotRepository = lotRepository;
    }

    @Override
    public Auction createAuctionWithLots(AuctionWithLotsDTO request) {
        Auction auction = new Auction();

        AuctionType auctionType = auctionTypeService.findByAuctionTypeName(request.getAuctionTypeName());
        auction.setAuctionType(auctionType);
        auction.setStartTime(request.getStartTime());
        auction.setEndTime(request.getEndTime());
        auction.setStatus(AuctionStatusEnum.WAITING);

        Auction savedAuction = auctionRepository.save(auction);

        List<Lot> lots = new ArrayList<>();
        for(LotDTO lotDTO : request.getLots()){
            Lot lot = new Lot();
            lot.setAuction(auction);
            lot.setKoiFish(koiFishService.findByFishId(lotDTO.getFishId()));
            lot.setDeposit(lotDTO.getDeposit());
            lot.setStartingPrice(lotDTO.getStartingPrice());
            lot.setIncrement(lotDTO.getIncrement());
            lot.setStartingTime(savedAuction.getStartTime());
            lot.setEndingTime(savedAuction.getEndTime());
            lot.setStatus(LotStatusEnum.WAITING);
            lots.add(lot);
        }

        lotRepository.saveAll(lots);
        savedAuction.setLots(lots);
        auctionRepository.save(savedAuction);

        return savedAuction;
    }
}
