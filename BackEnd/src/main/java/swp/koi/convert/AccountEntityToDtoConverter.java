package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Configuration;
import swp.koi.dto.response.AccountResponseDTO;
import swp.koi.model.Account;

@Configuration
@RequiredArgsConstructor
public class AccountEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public AccountResponseDTO convertAccount(Account account){
        AccountResponseDTO response = modelMapper.map(account, AccountResponseDTO.class);
        return response;
    }

}
