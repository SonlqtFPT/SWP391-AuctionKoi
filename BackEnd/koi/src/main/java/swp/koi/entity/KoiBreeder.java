package swp.koi.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KoiBreeder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int breederId;

    @Column(nullable = false, unique = true)
    String breederName;

    String location;

    Boolean isDeleted;

    @OneToOne
    Account account;

    @OneToMany(mappedBy = "koiBreeder", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    List<AuctionRequest> auctionRequest;

    @OneToMany(mappedBy = "koiBreeder", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    List<KoiFish> koiFishList;
}
