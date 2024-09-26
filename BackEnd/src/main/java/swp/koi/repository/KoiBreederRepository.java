package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.KoiBreeder;

import java.util.Optional;

@Repository
public interface KoiBreederRepository extends JpaRepository<KoiBreeder, Integer> {
    Optional<KoiBreeder> findByBreederId(Integer breederId);
}
