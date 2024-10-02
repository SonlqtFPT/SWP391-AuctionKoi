package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Configuration;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.model.AuctionRequest;

@Configuration
@RequiredArgsConstructor
public class AuctionRequestDtoToEntityConverter {

    private final ModelMapper modelMapper;

    public AuctionRequest convertRequest(AuctionRequestDTO auctionRequestDTO){
        AuctionRequest auctionRequest = modelMapper.map(auctionRequestDTO, AuctionRequest.class);
        return auctionRequest;
    }

}
