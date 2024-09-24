package swp.koi.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AuctionStatusEnum;
import swp.koi.model.enums.AuctionTypeNameEnum;

import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "AuctionType")
public class AuctionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer auctionTypeId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AuctionTypeNameEnum auctionTypeName;

    @OneToMany(mappedBy = "auctionType")
    List<Auction> auctions;

    public AuctionType() {
    }

    public AuctionType(AuctionTypeNameEnum auctionTypeName, List<Auction> auctions){
        this.auctionTypeName = auctionTypeName;
        this.auctions = auctions;
    }
}
