package swp.koi.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Variety {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int varietyId;

    String varietyName;

    @OneToMany(mappedBy = "variety")
    List<KoiFish> koiFish;
}
