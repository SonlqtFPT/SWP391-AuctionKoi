package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.AuctionRequestResponseDTO;
import swp.koi.model.AuctionRequest;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuctionRequestEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public AuctionRequestResponseDTO convertAuctionRequest(AuctionRequest auctionRequest){
        AuctionRequestResponseDTO response = modelMapper.map(auctionRequest, AuctionRequestResponseDTO.class);
        return response;
    }

    public List<AuctionRequestResponseDTO> convertAuctionRequestList(List<AuctionRequest> auctionRequests){
        List<AuctionRequestResponseDTO> response = auctionRequests
                .stream()
                .map(auctionRequest -> modelMapper.map(auctionRequest, AuctionRequestResponseDTO.class))
                .collect(Collectors.toList());
        return response;
    }

}
