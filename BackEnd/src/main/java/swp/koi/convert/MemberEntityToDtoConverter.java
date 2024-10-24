package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.AccountResponseDTO;
import swp.koi.dto.response.MemberResponseDTO;
import swp.koi.model.Account;
import swp.koi.model.Member;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MemberEntityToDtoConverter {
    private final ModelMapper modelMapper;

    public MemberResponseDTO convertMember(Member member){
        MemberResponseDTO dto = modelMapper.map(member, MemberResponseDTO.class);
        return dto;
    }
}
