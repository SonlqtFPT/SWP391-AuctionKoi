package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Column(name = "bidTime", nullable = false)
    LocalDateTime bidTime;

    @PrePersist
    protected void onCreate() {
        bidTime = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "memberId")
    Member member;

    @ManyToOne
    @JoinColumn(name = "lotId")
    Lot lot;

    public Bid() {
    }


}
