package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.AccountResponseDTO;
import swp.koi.dto.response.AuctionRequestResponseDTO;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.dto.response.KoiFishResponseDTO;
import swp.koi.model.AuctionRequest;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuctionRequestEntityToDtoConverter {

    private final ModelMapper modelMapper;
    private final AccountEntityToDtoConverter accountEntityToDtoConverter;

    public AuctionRequestResponseDTO convertAuctionRequest(AuctionRequest auctionRequest){
        AuctionRequestResponseDTO response = modelMapper.map(auctionRequest, AuctionRequestResponseDTO.class);
        return response;
    }

    public List<AuctionRequestResponseDTO> convertAuctionRequestList(List<AuctionRequest> auctionRequests){
        List<AuctionRequestResponseDTO> response = auctionRequests
                .stream()
                .filter(Objects::nonNull)
                .map(auctionRequest -> {
                    AuctionRequestResponseDTO dto = modelMapper.map(auctionRequest, AuctionRequestResponseDTO.class);
                    dto.getKoiFish().setAuctionTypeName(auctionRequest.getKoiFish().getAuctionType().getAuctionTypeName());
                    if(auctionRequest.getAccount() == null) {
                        dto.setStaff(null);
                    }else {
                        dto.setStaff(accountEntityToDtoConverter.convertAccount(auctionRequest.getAccount()));
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        return response;
    }

}
