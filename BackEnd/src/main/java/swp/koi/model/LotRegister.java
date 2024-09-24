package swp.koi.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.LotRegisterStatusEnum;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "LotRegister")
public class LotRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer LRID;

    @Column(nullable = false)
    float deposit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    LotRegisterStatusEnum status;

    @ManyToOne
    @JoinColumn(name = "memberId")
    Member member;

    @OneToOne(mappedBy = "lotRegister")
    Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "lotId")
    Lot lot;

    public LotRegister() {
    }

    public LotRegister(float deposit, LotRegisterStatusEnum status, Member member, Invoice invoice, Lot lot) {
        this.deposit = deposit;
        this.status = status;
        this.member = member;
        this.invoice = invoice;
        this.lot = lot;
    }
}
