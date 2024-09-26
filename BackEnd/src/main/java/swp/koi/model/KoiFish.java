package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.KoiFishStatusEnum;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "KoiFish")
public class KoiFish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer fishId;

    @Column(nullable = false)
    String gender;

    @Column(nullable = false)
    int age;

    @Column(nullable = false)
    float size;

    @Column(nullable = false)
    float price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    KoiFishStatusEnum status;

    @OneToOne(mappedBy = "koiFish", cascade = CascadeType.ALL)
    @JsonManagedReference
    @JsonIgnore
    AuctionRequest auctionRequest;

    @OneToOne()
    @JoinColumn(name = "mediaId")
    @JsonBackReference
    Media media;

    @ManyToOne
    @JoinColumn(name = "varietyId", nullable = false)
    Variety variety;

    @OneToOne(mappedBy = "koiFish")
    @JsonIgnore
    Lot lot;

    public KoiFish() {
    }

    public KoiFish(String gender, int age, float size, float price, KoiFishStatusEnum status, AuctionRequest auctionRequest, Media media, Variety variety) {
        this.gender = gender;
        this.age = age;
        this.size = size;
        this.price = price;
        this.status = status;
        this.auctionRequest = auctionRequest;
        this.media = media;
        this.variety = variety;
    }

    public KoiFish(String gender, int age, float size, float price, KoiFishStatusEnum status, AuctionRequest auctionRequest, Media media, Variety variety, Lot lot) {
        this.gender = gender;
        this.age = age;
        this.size = size;
        this.price = price;
        this.status = status;
        this.auctionRequest = auctionRequest;
        this.media = media;
        this.variety = variety;
        this.lot = lot;
    }
}
