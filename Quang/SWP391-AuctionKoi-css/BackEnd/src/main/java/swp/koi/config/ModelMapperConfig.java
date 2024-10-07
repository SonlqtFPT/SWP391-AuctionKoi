package swp.koi.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.response.KoiFishResponseDTO;
import swp.koi.model.AuctionRequest;
import swp.koi.model.KoiFish;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.typeMap(AuctionRequest.class, AuctionRequestDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getKoiFish(), AuctionRequestDTO::setKoiFish);
        });

//        modelMapper.typeMap(KoiFish.class, KoiFishResponseDTO.class).addMappings()

        return modelMapper;
    }

}
