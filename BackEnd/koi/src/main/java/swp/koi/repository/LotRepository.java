package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import swp.koi.entity.Lot;

public interface LotRepository extends JpaRepository<Lot, Integer> {
}
