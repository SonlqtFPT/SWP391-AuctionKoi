package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.AccountResponseDTO;
import swp.koi.model.Account;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MemberEntityToDtoConverter {
    private final ModelMapper modelMapper;


}
