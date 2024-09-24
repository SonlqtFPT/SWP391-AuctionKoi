package swp.koi.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AuctionRequestStatusEnum;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "AuctionRequest")
public class AuctionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer requestId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AuctionRequestStatusEnum status;

    @OneToOne
    @JoinColumn(name = "accountId")
    Account account;

    @ManyToOne
    @JoinColumn(name = "breederId")
    KoiBreeder koiBreeder;

    @OneToOne
    @JoinColumn(name = "fishId")
    KoiFish koiFish;

    public AuctionRequest() {
    }

    public AuctionRequest(AuctionRequestStatusEnum status, Account account, KoiBreeder koiBreeder, KoiFish koiFish) {
        this.status = status;
        this.account = account;
        this.koiBreeder = koiBreeder;
        this.koiFish = koiFish;
    }
}
