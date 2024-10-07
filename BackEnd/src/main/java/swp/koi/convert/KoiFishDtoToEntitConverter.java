package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Configuration;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.model.KoiFish;

@Configuration
@RequiredArgsConstructor
public class KoiFishDtoToEntitConverter {

    private final ModelMapper modelMapper;

    public KoiFish convertFish(KoiFishDTO koiFishDTO){
        KoiFish koiFish = modelMapper.map(koiFishDTO, KoiFish.class);
        return koiFish;
    }


}
