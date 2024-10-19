package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Auction;
import swp.koi.model.enums.AuctionStatusEnum;

import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Integer> {
    List<Auction> findAllByStatus(AuctionStatusEnum status);

    List<Auction> findAllByStatusIn(List<AuctionStatusEnum> statues);
}
