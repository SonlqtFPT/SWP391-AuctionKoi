package swp.koi.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AuctionStatusEnum;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Auction")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer auctionId;

    @Column(nullable = false)
    java.util.Date startTime;

    @Column(nullable = false)
    java.util.Date endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AuctionStatusEnum status;

    @OneToMany(mappedBy = "auction")
    List<Lot> lots;

    @ManyToOne
    @JoinColumn(name = "auctionTypeId")
    AuctionType auctionType;

    public Auction() {
    }

    public Auction(Date startTime, Date endTime, AuctionStatusEnum status, List<Lot> lots, AuctionType auctionType) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.lots = lots;
        this.auctionType = auctionType;
    }
}
