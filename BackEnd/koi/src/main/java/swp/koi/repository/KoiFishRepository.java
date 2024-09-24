package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import swp.koi.entity.KoiFish;

public interface KoiFishRepository extends JpaRepository<KoiFish, Integer> {
}
