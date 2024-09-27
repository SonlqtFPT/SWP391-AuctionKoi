package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.FullLotResponseDTO;
import swp.koi.model.Lot;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class LotEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public List<FullLotResponseDTO> convertLotList(List<Lot> lots){
        List<FullLotResponseDTO> response = lots.stream()
                .map(lot -> modelMapper.map(lot, FullLotResponseDTO.class))
                .collect(Collectors.toList());
        return response;
    }

}
