package swp.koi.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.enums.AuctionStatusEnums;

import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Lot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int lotId;

    float deposit;

    float startingPrice;

    float increasePrice;

    float currentPrice;


    String currentWinner;

    @Enumerated(EnumType.STRING)
    AuctionStatusEnums auctionLotStatus;

    @ManyToOne
    KoiFish koiFish;

    @ManyToOne
    Auction auction;

    @OneToMany(mappedBy = "lot")
    List<LotRegister> lotRegister;

    @OneToMany(mappedBy = "lot")
    List<Bid> bidList;
}
