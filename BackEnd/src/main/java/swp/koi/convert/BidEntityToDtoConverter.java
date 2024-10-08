package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.BidResponseDTO;
import swp.koi.model.Bid;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
@Component
@RequiredArgsConstructor
public class BidEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public List<BidResponseDTO> convertBidList(List<Bid> bids){
        List<BidResponseDTO> response = bids
                .stream()
                .map(bid -> modelMapper.map(bid, BidResponseDTO.class))
                .collect(Collectors.toList());
        return response;
    }

}
