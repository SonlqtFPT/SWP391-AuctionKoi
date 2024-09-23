package swp.koi.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.enums.AuctionStatusEnums;

import java.util.Date;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int auctionId;

    Date startTime;

    Date endTime;

    @Enumerated(EnumType.STRING)
    AuctionStatusEnums auctionStatus;

    @OneToMany(mappedBy = "auction")
    List<Lot> lot;
}
