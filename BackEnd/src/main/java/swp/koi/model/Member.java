package swp.koi.model;

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
@Table(name = "Member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer memberId;

    @OneToOne
    @JoinColumn(name = "accountId", nullable = false)
    Account account;

    @OneToMany(mappedBy = "member")
    List<LotRegister> lotRegisters;

    @OneToMany(mappedBy = "member")
    List<Bid> bids;

    public Member() {
    }

    public Member(Account account, List<LotRegister> lotRegisters, List<Bid> bids) {
        this.account = account;
        this.lotRegisters = lotRegisters;
        this.bids = bids;
    }
}
