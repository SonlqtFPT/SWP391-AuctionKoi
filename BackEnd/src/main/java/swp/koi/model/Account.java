package swp.koi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import swp.koi.model.enums.AccountRoleEnum;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Account")
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

    public Account(String email, String firstName, String lastName, String password, String phoneNumber, AccountRoleEnum role, boolean status) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.status = status;
    }

}



