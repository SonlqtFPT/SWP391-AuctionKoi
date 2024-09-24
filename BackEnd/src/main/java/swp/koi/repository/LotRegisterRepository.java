package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.LotRegister;

@Repository
public interface LotRegisterRepository extends JpaRepository<LotRegister, Integer> {
}
