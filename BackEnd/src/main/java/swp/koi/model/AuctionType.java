package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    List<Lot> lots;

    @OneToMany(mappedBy = "auctionType")
    List<KoiFish> koiFishes;

    @OneToMany(mappedBy = "auctionType")
    List<AuctionRequest> auctionRequest;

    public AuctionType() {
    }

    public AuctionType(AuctionTypeNameEnum auctionTypeName, List<Auction> auctions){
        this.auctionTypeName = auctionTypeName;
    }
}
