package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.LotRegisterStatusEnum;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "LotRegister")
@Builder
@AllArgsConstructor
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

    @OneToOne(mappedBy = "lotRegister", fetch = FetchType.LAZY)
    Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lotId")
    @JsonIgnore
    Lot lot;

    public LotRegister() {
    }


}
