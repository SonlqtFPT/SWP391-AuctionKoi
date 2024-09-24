package swp.koi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "[Transaction]")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer transactionId;

    @Column(nullable = false)
    String transactionType;

    @Column(nullable = false)
    int docNo;

    @Column(nullable = false)
    float amount;

    public Transaction() {
    }

    public Transaction(String transactionType, int docNo, float amount) {
        this.transactionType = transactionType;
        this.docNo = docNo;
        this.amount = amount;
    }
}
