package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Member")
@AllArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer memberId;

    @OneToOne
    @JoinColumn(name = "accountId", nullable = false)
    Account account;

    @OneToMany(mappedBy = "member",fetch = FetchType.LAZY)
    @JsonIgnore
    List<LotRegister> lotRegisters;

    @OneToMany(mappedBy = "member",fetch = FetchType.LAZY)
    @JsonIgnore
    List<Bid> bids;

    public Member() {
    }

}
