package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Variety;

@Repository
public interface VarietyRepository extends JpaRepository<Variety, Integer> {
}
