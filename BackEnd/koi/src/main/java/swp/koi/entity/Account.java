package swp.koi.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import swp.koi.enums.Role;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int account_id;

    @Column(nullable = false, unique = true)
    String email;

    @Column(nullable = false)
    String password;

    String display_name;

    String phone_number;

    @Enumerated(EnumType.STRING)
    Role role;

    @OneToOne(mappedBy = "account")
    KoiBreeder koiBreeder;

    @OneToOne(mappedBy = "account")
    Member member;
}
