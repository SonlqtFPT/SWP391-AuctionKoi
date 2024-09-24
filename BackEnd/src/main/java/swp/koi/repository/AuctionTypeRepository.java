package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.AuctionType;

@Repository
public interface AuctionTypeRepository extends JpaRepository<AuctionType, Integer> {
}
