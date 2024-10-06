package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Media;

@Repository
public interface MediaRepository extends JpaRepository<Media, Integer> {
}
