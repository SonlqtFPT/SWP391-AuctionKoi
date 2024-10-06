package swp.koi.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Invoice")
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

    String paymentLink;


    @OneToOne
    @JoinColumn(name = "LRID")
    LotRegister lotRegister;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    Transaction transaction;

}
