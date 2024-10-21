package swp.koi.service.auctionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import swp.koi.convert.LotEntityToDtoConverter;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.dto.request.LotDTO;
import swp.koi.dto.response.*;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.AuctionStatusEnum;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.model.enums.LotStatusEnum;
import swp.koi.repository.AuctionRepository;
import swp.koi.service.auctionRequestService.AuctionRequestService;
import swp.koi.service.auctionTypeService.AuctionTypeService;
import swp.koi.service.koiFishService.KoiFishService;
import swp.koi.service.lotService.LotService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService{

    private final AuctionRepository auctionRepository;
    private final LotService lotService;
    private final AuctionTypeService auctionTypeService;
    private final KoiFishService koiFishService;
    private final ModelMapper modelMapper;
    private final AuctionRequestService auctionRequestService;
    private final LotEntityToDtoConverter lotEntityToDtoConverter;

    @Override
    @Scheduled(fixedDelay = 1000 * 60)
    public void updateAuctionStatusAndEndTime(){
        List<Auction> auctions = auctionRepository.findAllByStatus(AuctionStatusEnum.AUCTIONING);
        if(auctions.isEmpty()){
            return;
        }
        for(Auction auction : auctions){
            List<Lot> lots = auction.getLots();
            LocalDateTime maxEndingTime = lots.stream()
                    .map(Lot::getEndingTime)
                    .max(LocalDateTime::compareTo)
                    .orElse(null);
            auction.setEndTime(maxEndingTime);
            auctionRepository.save(auction);
        }

        List<Auction> auctionsToBeEnd = auctionRepository.findAllByStatusAndEndTimeLessThan(AuctionStatusEnum.AUCTIONING, LocalDateTime.now());
        for(Auction auction : auctionsToBeEnd){
            auction.setStatus(AuctionStatusEnum.COMPLETED);
            auctionRepository.save(auction);
        }

    }

    @Override
    public AuctionResponseDTO createAuctionWithLots(AuctionWithLotsDTO request) throws KoiException{
        try{
            Auction auction = new Auction();
            AuctionType auctionType = auctionTypeService.findByAuctionTypeName(request.getAuctionTypeName());

            if(!isValidAuctionTime(request.getStartTime(), request.getEndTime()))
                throw new KoiException(ResponseCode.AUCTION_TIME_INVALID);

            if(request.getLots().isEmpty()){
                throw new KoiException(ResponseCode.NO_LOTS_PROVIDED);
            }

            for(LotDTO lotDTO : request.getLots()){
                KoiFish koiFish = koiFishService.findByFishId(lotDTO.getFishId());
                if(koiFish == null || !koiFish.getStatus().equals(KoiFishStatusEnum.WAITING) ||
                        !koiFish.getAuctionType().equals(auctionType)){
                    throw new KoiException(ResponseCode.FAIL);
                }
            }

            auction.setAuctionType(auctionType);
            auction.setStartTime(request.getStartTime());
            auction.setEndTime(request.getEndTime());
            auction.setStatus(AuctionStatusEnum.WAITING);

            Auction savedAuction = auctionRepository.save(auction);

            List<Lot> lots = new ArrayList<>();
            for(LotDTO lotDTO : request.getLots()){
                Lot lot = new Lot();
                KoiFish koiFish = koiFishService.findByFishId(lotDTO.getFishId());
                koiFish.setStatus(KoiFishStatusEnum.AUCTIONING);
                koiFishService.saveFish(koiFish);
                    lot.setAuction(auction);
                    lot.setKoiFish(koiFish);
                    lot.setDeposit((float)(koiFish.getPrice()*0.1));
                    lot.setStartingPrice(koiFish.getPrice());
                    lot.setIncrement((float)(koiFish.getPrice()*0.1));
                    lot.setCurrentPrice(lot.getStartingPrice());
                    lot.setStartingTime(savedAuction.getStartTime());
                    lot.setEndingTime(savedAuction.getEndTime());
                    lot.setStatus(LotStatusEnum.WAITING);
                    lots.add(lot);
            }

            lotService.createLots(lots);
            savedAuction.setLots(lots);

            List<LotResponseDto> lotResponse = lotEntityToDtoConverter.convertLotList(lots);
            AuctionResponseDTO auctionResponse = modelMapper.map(savedAuction, AuctionResponseDTO.class);
            auctionResponse.setLots(lotResponse);
            return auctionResponse;
        }catch (KoiException e){
            throw e;
        }
    }



    private boolean isValidAuctionTime(LocalDateTime startTime, LocalDateTime endTime) {

        if(startTime.isBefore(LocalDateTime.now()) ||
                endTime.isBefore((LocalDateTime.now())) ||
                startTime.isAfter(endTime) ||
                startTime.isEqual(endTime) ||
                isAuctionTimeOverlapping(startTime, endTime)){
            return false;
        }

        return true;
    }

    private boolean isAuctionTimeOverlapping(LocalDateTime startTime, LocalDateTime endTime){

        List<AuctionStatusEnum> statues = Arrays.asList(
                AuctionStatusEnum.WAITING,
                AuctionStatusEnum.AUCTIONING
        );

        List<Auction> notLaunchAuction = auctionRepository.findAllByStatusIn(statues);

        for(Auction auction : notLaunchAuction){
            if (startTime.isEqual(auction.getStartTime()) ||
                    endTime.isEqual(auction.getEndTime()) ||
                    (startTime.isAfter(auction.getStartTime()) && startTime.isBefore(auction.getEndTime())) ||
                    (endTime.isAfter(auction.getStartTime()) && endTime.isBefore(auction.getEndTime())) ||
                    (startTime.isBefore(auction.getStartTime()) && endTime.isAfter(auction.getEndTime()))) {
                return true;
            }
        }

        return false;
    }

    @Override
    public LotResponseDto getLot(Integer lotId) throws KoiException{
        Lot lot = lotService.findLotById(lotId);
        LotResponseDto dto = new LotResponseDto();
        modelMapper.map(lot, dto);
        dto.getKoiFish().setImageUrl(lot.getKoiFish().getMedia().getImageUrl());
        dto.getKoiFish().setVideoUrl(lot.getKoiFish().getMedia().getVideoUrl());
        dto.getKoiFish().setBreederName(lot.getKoiFish().getAuctionRequest().getKoiBreeder().getBreederName());
        return dto;
    }

    @Override
    public List<Auction> getAllAuction() {
        return auctionRepository.findAll();
    }

    @Override
    public Auction getAuction(Integer auctionId) throws KoiException{
        return auctionRepository.findById(auctionId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_NOT_FOUND));
    }

    @Override
    public List<Auction> getAllOnGoingAuction() {
        return auctionRepository.findAllByStatus(AuctionStatusEnum.AUCTIONING);
    }

    @Override
    public List<Auction> getAllCompletedAuction() {
        return auctionRepository.findAllByStatus(AuctionStatusEnum.COMPLETED);
    }
}
