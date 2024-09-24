package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Bid;

@Repository
public interface BidRepository extends JpaRepository<Bid, Integer> {
}
