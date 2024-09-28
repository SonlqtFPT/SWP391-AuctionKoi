package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swp.koi.model.AuctionRequest;
import swp.koi.model.enums.AuctionRequestStatusEnum;

import java.util.List;

@Repository
public interface AuctionRequestRepository extends JpaRepository<AuctionRequest, Integer> {
    @Query("SELECT ar FROM AuctionRequest ar WHERE ar.status = :status")
    List<AuctionRequest> findAllFishByStatus(@Param("status") AuctionRequestStatusEnum status);
}
