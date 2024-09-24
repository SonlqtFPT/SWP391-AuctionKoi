package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.KoiBreeder;

@Repository
public interface KoiBreederRepository extends JpaRepository<KoiBreeder, Integer> {
}
