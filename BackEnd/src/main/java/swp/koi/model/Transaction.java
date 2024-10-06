package swp.koi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.TransactionTypeEnum;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "[Transaction]")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionTypeEnum transactionType;

    private LocalDateTime transactionDate;

    @Column(nullable = false)
    private float amount;

    @Column(nullable = false)
    private String paymentStatus;

    @ManyToOne
    @JoinColumn(name = "lot_id")
    private Lot lot;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "breeder_id")
    private KoiBreeder breeder;

    @OneToOne(mappedBy = "transaction")
    private Invoice invoice;
}
