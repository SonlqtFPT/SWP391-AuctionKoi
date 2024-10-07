package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.BidResponseDTO;
import swp.koi.dto.response.MemberResponseDTO;
import swp.koi.model.Account;
import swp.koi.model.Bid;
import swp.koi.model.Member;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;
@Component
@RequiredArgsConstructor
public class BidEntityToDtoConverter {

    private final ModelMapper modelMapper;
    private final AccountEntityToDtoConverter accountEntityToDtoConverter;

    public List<BidResponseDTO> convertBidList(List<Bid> bids){
        List<BidResponseDTO> response = bids
                .stream()
                .map(bid -> {
                    BidResponseDTO dto = modelMapper.map(bid, BidResponseDTO.class);
                    MemberResponseDTO memberDto = new MemberResponseDTO();
                    memberDto.setAccount(accountEntityToDtoConverter
                            .convertAccount(bid.getMember().getAccount()));
                    dto.setMember(memberDto);
                    return dto;
                })
                .collect(Collectors.toList());
        return response;
    }

}
