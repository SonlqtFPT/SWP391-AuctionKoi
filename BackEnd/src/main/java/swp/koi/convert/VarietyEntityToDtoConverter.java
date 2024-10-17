package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.VarietyResponseDTO;
import swp.koi.model.Variety;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class VarietyEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public List<VarietyResponseDTO> convertVarietyList(List<Variety> varieties){
        List<VarietyResponseDTO> response = varieties.stream()
                .map(variety -> modelMapper.map(variety, VarietyResponseDTO.class))
                .collect(Collectors.toList());
        return response;
    }

}
