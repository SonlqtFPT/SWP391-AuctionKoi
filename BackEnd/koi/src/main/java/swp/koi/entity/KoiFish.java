package swp.koi.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.enums.KoiStatusEnums;

import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KoiFish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int fishId;

    String gender;

    int age;

    float size;

    float price;

    @Enumerated(EnumType.STRING)
    KoiStatusEnums koiStatus;

    @ManyToOne
    KoiBreeder koiBreeder;

    @ManyToOne
    Variety variety;

    @OneToMany(mappedBy = "koiFish")
    List<Lot> lot;

    @OneToOne(mappedBy = "koiFish")
    Invoice invoice;

    @OneToOne
    AuctionRequest auctionRequest;
}
