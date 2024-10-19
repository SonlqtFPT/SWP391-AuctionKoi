package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.FullLotResponseDTO;
import swp.koi.dto.response.LotResponseDto;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Lot;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class LotEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public LotResponseDto convertLot(Lot lot){
        if(lot == null)
            throw new KoiException(ResponseCode.LOT_NOT_FOUND);
        LotResponseDto response = modelMapper.map(lot, LotResponseDto.class);
        return response;
    }

    public List<LotResponseDto> convertLotList(List<Lot> lots){
        List<LotResponseDto> response = lots.stream()
                .map(lot -> {
                    LotResponseDto dto = modelMapper.map(lot, LotResponseDto.class);
                    dto.getKoiFish().setImageUrl(lot.getKoiFish().getMedia().getImageUrl());
                    dto.getKoiFish().setVideoUrl(lot.getKoiFish().getMedia().getVideoUrl());
                    dto.getKoiFish().setBreederName(lot.getKoiFish().getAuctionRequest().getKoiBreeder().getBreederName());
                    return dto;
                })
                .collect(Collectors.toList());
        return response;
    }

}
