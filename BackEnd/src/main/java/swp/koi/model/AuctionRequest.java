package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonBackReference
    Account account;

    @ManyToOne
    @JoinColumn(name = "breederId")
    @JsonBackReference
    KoiBreeder koiBreeder;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fishId")
    @JsonManagedReference
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
