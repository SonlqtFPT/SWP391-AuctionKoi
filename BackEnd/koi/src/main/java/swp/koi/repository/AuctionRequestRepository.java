package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import swp.koi.entity.AuctionRequest;

public interface AuctionRequestRepository extends JpaRepository<AuctionRequest, Integer> {
}
