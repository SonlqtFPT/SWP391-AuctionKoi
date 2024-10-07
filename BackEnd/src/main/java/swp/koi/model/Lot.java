package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.lang.Nullable;
import swp.koi.model.enums.LotStatusEnum;

import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Lot")
@AllArgsConstructor
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

    @Column(columnDefinition = "integer null")
    Integer currentMemberId;

    float currentPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    LotStatusEnum status;

    @ManyToOne
    KoiFish koiFish;

    @OneToMany(mappedBy = "lot")
    List<LotRegister> lotRegisters;

    @OneToMany(mappedBy = "lot",fetch = FetchType.LAZY)
    List<Bid> bids;

    @ManyToOne
    @JoinColumn(name = "auctionId")
    Auction auction;

    @OneToMany(mappedBy = "lot")
    List<Transaction> transactions;

    @OneToOne(mappedBy = "lot")
    Invoice invoice;

    public Lot() {
    }


}
