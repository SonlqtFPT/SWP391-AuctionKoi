package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.AuctionResponseDTO;
import swp.koi.dto.response.MediaResponseDTO;
import swp.koi.dto.response.VarietyResponseDTO;
import swp.koi.model.Auction;
import swp.koi.model.Lot;
import swp.koi.model.Media;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuctionEntityToDtoConverter {

    private final ModelMapper modelMapper;
    private final LotEntityToDtoConverter lotEntityToDtoConverter;

    public List<AuctionResponseDTO> converAuctiontList(List<Auction> auctions){
        List<AuctionResponseDTO> response = auctions
                .stream()
                .map(auction -> {
                    AuctionResponseDTO dto = modelMapper.map(auction, AuctionResponseDTO.class);
                    dto.setLots(lotEntityToDtoConverter.convertLotList(auction.getLots()));
                    return dto;
                }).collect(Collectors.toList());
        return response;
    }

    public AuctionResponseDTO convertAuction(Auction auction){
        AuctionResponseDTO response = modelMapper.map(auction, AuctionResponseDTO.class);
        response.setLots(lotEntityToDtoConverter.convertLotList(auction.getLots()));
        return response;
    }

}
