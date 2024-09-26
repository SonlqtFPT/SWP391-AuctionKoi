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
@Table(name = "Bid")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer bidId;

    @Column(nullable = false)
    float bidAmount;

    @Column(nullable = false)
    java.time.LocalDateTime bidTime;

    @ManyToOne
    @JoinColumn(name = "memberId")
    Member member;

    @ManyToOne
    @JoinColumn(name = "lotId")
    Lot lot;

    public Bid() {
    }

    public Bid(float bidAmount, LocalDateTime bidTime, Member member, Lot lot) {
        this.bidAmount = bidAmount;
        this.bidTime = bidTime;
        this.member = member;
        this.lot = lot;
    }
}
