package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AccountRoleEnum;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Account")
@Builder
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer accountId;

    @Column(nullable = false, unique = true)
    String email;

    @Column(nullable = false)
    String firstName;

    @Column(nullable = false)
    String lastName;

    @Column(nullable = false)
    String password;

    @Column(nullable = false)
    String phoneNumber;

    @Enumerated(EnumType.STRING)
    AccountRoleEnum role;

    @ElementCollection(fetch = FetchType.EAGER)
    List<AccountRoleEnum> roles = new ArrayList<>();

    @Column(nullable = false)
    boolean status;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    Member member;

    @OneToOne(mappedBy = "account")
    KoiBreeder koiBreeder;

    @OneToOne(mappedBy = "account")
    AuctionRequest auctionRequest;

    public Account() {
    }


}



