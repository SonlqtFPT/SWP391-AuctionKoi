package swp.koi.model;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.InvoiceStatusEnums;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Invoice")
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer invoiceId;

    @Column(nullable = false)
    float finalAmount;

    @Column(nullable = false)
    java.time.LocalDateTime invoiceDate;

    float tax;

    LocalDateTime dueDate;

    float subTotal;

    @Min(value = 0, message = "distance must be > 0")
    Double kilometers;

    String address;

    @Enumerated(EnumType.STRING)
    InvoiceStatusEnums status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    Member member;

    @Column(name = "paymentLink", length = 2048)

    String paymentLink;

    @OneToOne
    @JoinColumn(name = "Lot_id")
    Lot lot;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    Transaction transaction;

    @ManyToOne
    @JoinColumn(name = "fishId")
    KoiFish koiFish;

    @ManyToOne
    @JoinColumn(name = "accountId")
    Account account;
}
