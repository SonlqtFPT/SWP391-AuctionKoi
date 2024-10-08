package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.cglib.core.Local;
import swp.koi.model.enums.AuctionStatusEnum;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Auction")
@AllArgsConstructor
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer auctionId;

    @Column(nullable = false)
    java.time.LocalDateTime startTime;

    @Column(nullable = false)
    java.time.LocalDateTime endTime;

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

}
