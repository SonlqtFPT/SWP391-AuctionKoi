package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "KoiBreeder")
public class KoiBreeder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer breederId;

    @Column(nullable = false)
    String breederName;

    @Column(nullable = false)
    String location;

    @Column(nullable = false)
    boolean status;

    @OneToOne
    @JoinColumn(name = "accountId", nullable = false)
    Account account;

    @OneToMany(mappedBy = "koiBreeder")
    List<AuctionRequest> auctionRequests;


    public KoiBreeder() {
    }

    public KoiBreeder(String breederName, String location, boolean status, Account account) {
        this.breederName = breederName;
        this.location = location;
        this.status = status;
        this.account = account;
    }
}
