package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Configuration;
import swp.koi.dto.response.AccountFullResponseDto;
import swp.koi.dto.response.AccountResponseDTO;
import swp.koi.model.Account;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class AccountEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public AccountResponseDTO convertAccount(Account account){
        AccountResponseDTO response = modelMapper.map(account, AccountResponseDTO.class);
        return response;
    }

    public List<AccountResponseDTO> convertAccountList(List<Account> accountList){
        List<AccountResponseDTO> response = accountList
                .stream()
                .map(account -> modelMapper.map(account, AccountResponseDTO.class))
                .collect(Collectors.toList());
        return response;
    }

    public List<AccountFullResponseDto> convertAccountFullList(List<Account> accountList){
        List<AccountFullResponseDto> response = accountList
                .stream()
                .map(account -> modelMapper.map(account, AccountFullResponseDto.class))
                .collect(Collectors.toList());
        return response;
    }

}
