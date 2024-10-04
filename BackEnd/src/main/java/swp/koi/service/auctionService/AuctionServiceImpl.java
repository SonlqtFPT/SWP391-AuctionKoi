package swp.koi.service.auctionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.dto.request.LotDTO;
import swp.koi.dto.request.UpdateStatusDTO;
import swp.koi.dto.response.AuctionResponseDTO;
import swp.koi.dto.response.FullLotResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.AuctionStatusEnum;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.model.enums.LotStatusEnum;
import swp.koi.repository.AuctionRepository;
import swp.koi.repository.LotRepository;
import swp.koi.service.auctionRequestService.AuctionRequestService;
import swp.koi.service.auctionTypeService.AuctionTypeService;
import swp.koi.service.koiFishService.KoiFishService;
import swp.koi.service.lotService.LotService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    public AuctionResponseDTO createAuctionWithLots(AuctionWithLotsDTO request) throws KoiException{
        try{
            Auction auction = new Auction();
            AuctionType auctionType = auctionTypeService.findByAuctionTypeName(request.getAuctionTypeName());

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
                    lot.setAuction(auction);
                    lot.setKoiFish(koiFish);
                    lot.setDeposit((float)(koiFish.getPrice()*0.1));
                    lot.setStartingPrice(lotDTO.getStartingPrice());
                    lot.setIncrement(lotDTO.getIncrement());
                    lot.setCurrentPrice(lot.getStartingPrice());
                    lot.setStartingTime(savedAuction.getStartTime());
                    lot.setEndingTime(savedAuction.getEndTime());
                    lot.setStatus(LotStatusEnum.WAITING);
                    lots.add(lot);
            }

            lotService.createLots(lots);
            savedAuction.setLots(lots);

            List<FullLotResponseDTO> lotResponse = lots.stream()
                    .map(lot -> modelMapper.map(lot, FullLotResponseDTO.class))
                    .collect(Collectors.toList());
            AuctionResponseDTO auctionResponse = modelMapper.map(savedAuction, AuctionResponseDTO.class);
            auctionResponse.setLots(lotResponse);
            return auctionResponse;
        }catch (KoiException e){
            throw e;
        }
    }
}
