package swp.koi.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer invoiceId;

    @Column(nullable = false)
    float totalAmount;

    @Column(nullable = false)
    java.time.LocalDateTime invoiceDate;

    @OneToOne
    @JoinColumn(name = "LRID")
    LotRegister lotRegister;

    public Invoice() {
    }

    public Invoice(float totalAmount, LocalDateTime invoiceDate, LotRegister lotRegister) {
        this.totalAmount = totalAmount;
        this.invoiceDate = invoiceDate;
        this.lotRegister = lotRegister;
    }
}
