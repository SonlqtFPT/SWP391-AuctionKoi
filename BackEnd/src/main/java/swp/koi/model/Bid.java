package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Bid")
@Builder
@AllArgsConstructor
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer bidId;

    @Column(nullable = false)
    float bidAmount;

    @Column(nullable = false)
    Date bidTime;

    @ManyToOne
    @JoinColumn(name = "memberId")
    Member member;

    @ManyToOne
    @JoinColumn(name = "lotId")
    @JsonIgnore
    Lot lot;

    public Bid() {
    }


}
