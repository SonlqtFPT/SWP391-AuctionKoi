package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.LotStatusEnum;

import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Lot")
public class Lot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer lotId;

    @Column(nullable = false)
    float deposit;

    @Column(nullable = false)
    float startingPrice;

    @Column(nullable = false)
    java.time.LocalDateTime startingTime;

    @Column(nullable = false)
    java.time.LocalDateTime endingTime;

    @Column(nullable = false)
    float increment;

    Integer currentMemberId;

    float currentPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    LotStatusEnum status;

    @OneToOne
    @JoinColumn(name = "fishId")
    KoiFish koiFish;

    @OneToMany(mappedBy = "lot", fetch = FetchType.LAZY)
    List<LotRegister> lotRegisters;

    @OneToMany(mappedBy = "lot", fetch = FetchType.LAZY)
    List<Bid> bids;

    @ManyToOne
    @JoinColumn(name = "auctionId")
    @JsonIgnore
    Auction auction;

    public Lot() {
    }

    public Lot(float deposit, float startingPrice, java.time.LocalDateTime startingTime, java.time.LocalDateTime endingTime,float increment, Integer currentMemberId, float currentPrice, LotStatusEnum status, KoiFish koiFish, List<LotRegister> lotRegisters, List<Bid> bids, Auction auction) {
        this.deposit = deposit;
        this.startingPrice = startingPrice;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
        this.increment = increment;
        this.currentMemberId = currentMemberId;
        this.currentPrice = currentPrice;
        this.status = status;
        this.koiFish = koiFish;
        this.lotRegisters = lotRegisters;
        this.bids = bids;
        this.auction = auction;
    }
}
