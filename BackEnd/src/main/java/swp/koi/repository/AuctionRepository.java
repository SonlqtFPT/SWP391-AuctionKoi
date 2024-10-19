package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Auction;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Integer> {
}
