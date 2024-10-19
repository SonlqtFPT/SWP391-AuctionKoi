package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swp.koi.model.Account;
import swp.koi.model.AuctionRequest;
import swp.koi.model.enums.AuctionRequestStatusEnum;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionRequestRepository extends JpaRepository<AuctionRequest, Integer> {
    @Query("SELECT ar FROM AuctionRequest ar WHERE ar.status = :status")
    List<AuctionRequest> findAllFishByStatus(@Param("status") AuctionRequestStatusEnum status);

    Optional<AuctionRequest> findByRequestId(Integer requestId);

    @Query("SELECT ar FROM AuctionRequest ar WHERE ar.account.id = :accountId")
    List<AuctionRequest> findAllRequestByAccountId(@Param("accountId") Integer accountId);

    @Query("SELECT ar FROM AuctionRequest ar WHERE ar.koiBreeder.id = :breederId")
    List<AuctionRequest> findAllByBreederId(Integer breederId);

    @Query("SELECT ar FROM AuctionRequest ar WHERE ar.status = :status AND ar.koiBreeder.id = :breederId")
    List<AuctionRequest> findAllByStatusAndBreederId(@Param("status") AuctionRequestStatusEnum status,
                                                     @Param("breederId") Integer breederId);

    @Query("SELECT ar FROM AuctionRequest ar WHERE ar.status IN :statuses AND ar.koiBreeder.id = :breederId")
    List<AuctionRequest> findAllByStatusInAndBreederId(@Param("statuses") List<AuctionRequestStatusEnum> statuses, @Param("breederId") Integer breederId);


    List<AuctionRequest> findAllByStatusIn(List<AuctionRequestStatusEnum> statues);
}
