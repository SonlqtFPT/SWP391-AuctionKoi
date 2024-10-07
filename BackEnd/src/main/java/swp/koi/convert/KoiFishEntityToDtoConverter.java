package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.dto.response.KoiFishResponseDTO;
import swp.koi.model.KoiFish;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class KoiFishEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public List<KoiFishResponseDTO> convertFishList(List<KoiFish> koiFishes){
        List<KoiFishResponseDTO> response = koiFishes.stream()
                .map(koiFish -> modelMapper.map(koiFish, KoiFishResponseDTO.class))
                .collect(Collectors.toList());
        return response;
    }

}
