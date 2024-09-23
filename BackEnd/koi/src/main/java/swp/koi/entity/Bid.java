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
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int bidId;

    float bidAmount;

    Date bitTime;

    @ManyToOne
    Lot lot;
}
