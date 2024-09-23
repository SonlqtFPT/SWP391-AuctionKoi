package swp.koi.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    float finalPrice;

    Date invoiceDate;

    @ManyToOne
    Member member;

    @OneToOne
    KoiFish koiFish;
}
