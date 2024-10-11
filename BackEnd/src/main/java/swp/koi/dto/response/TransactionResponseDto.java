package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.Lot;
import swp.koi.model.enums.TransactionTypeEnum;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionResponseDto {

    Integer transactionId;
    TransactionTypeEnum transactionType;
    float amount;
    String paymentStatus;
    LotResponseDto lot;
    AccountResponseDTO member;
    KoiBreederResponseDTO breeder;

}
