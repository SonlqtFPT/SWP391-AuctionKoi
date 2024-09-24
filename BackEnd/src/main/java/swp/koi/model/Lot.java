package swp.koi.model;

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
    float increment;

    @Column(nullable = false)
    Integer currentMemberId;

    @Column(nullable = false)
    float currentPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    LotStatusEnum status;

    @OneToOne
    @JoinColumn(name = "fishId")
    KoiFish koiFish;

    @OneToMany(mappedBy = "lot")
    List<LotRegister> lotRegisters;

    @OneToMany(mappedBy = "lot")
    List<Bid> bids;

    @ManyToOne
    @JoinColumn(name = "auctionId")
    Auction auction;

    public Lot() {
    }

    public Lot(float deposit, float startingPrice, float increment, Integer currentMemberId, float currentPrice, LotStatusEnum status, KoiFish koiFish, List<LotRegister> lotRegisters, List<Bid> bids, Auction auction) {
        this.deposit = deposit;
        this.startingPrice = startingPrice;
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
