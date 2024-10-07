package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.Member;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BidResponseDTO {

    Integer bidId;
    Integer lotId;
    float bidAmount;
    LocalDateTime bidTime;
    MemberResponseDTO member;

}
