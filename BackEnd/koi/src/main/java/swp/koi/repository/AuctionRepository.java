package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import swp.koi.entity.Auction;

public interface AuctionRepository extends JpaRepository<Auction, Integer> {
}
