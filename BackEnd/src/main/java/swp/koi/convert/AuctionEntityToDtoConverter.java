package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.AuctionResponseDTO;
import swp.koi.model.Auction;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuctionEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public List<AuctionResponseDTO> converAuctiontList(List<Auction> auctions){
        List<AuctionResponseDTO> response = auctions
                .stream()
                .map(auction -> modelMapper.map(auction, AuctionResponseDTO.class))
                .collect(Collectors.toList());
        return response;
    }

    public AuctionResponseDTO convertAuction(Auction auction){
        AuctionResponseDTO response = modelMapper.map(auction, AuctionResponseDTO.class);
        return response;
    }

}
