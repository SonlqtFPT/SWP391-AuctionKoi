package swp.koi.dto.response;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.InvoiceStatusEnums;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceResponseDto {

    Integer invoiceId;
    float finalAmount;
    LocalDateTime invoiceDate;
    float tax;
    LocalDateTime dueDate;
    float subTotal;
    InvoiceStatusEnums status;
    String paymentLink;
    KoiFishInLotResponseDto koiFish;

}
