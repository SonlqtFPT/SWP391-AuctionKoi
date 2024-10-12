package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Lot;
import swp.koi.model.LotRegister;
import swp.koi.model.Member;

import java.util.List;
import java.util.Optional;

@Repository
public interface LotRegisterRepository extends JpaRepository<LotRegister, Integer> {

    Optional<List<LotRegister>> findByLot(Lot lot);

    LotRegister findLotRegisterByLotAndMember(Lot lot, Member member);
}
