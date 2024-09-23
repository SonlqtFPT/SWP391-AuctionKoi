package swp.koi.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.enums.RequestEnums;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuctionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int requestId;

    @Enumerated(EnumType.STRING)
    RequestEnums requestStatus;

    @ManyToOne
    KoiBreeder koiBreeder;

    @OneToOne(mappedBy = "auctionRequest")
    KoiFish koiFish;

}
