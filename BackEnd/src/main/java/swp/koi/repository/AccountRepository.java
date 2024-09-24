package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
}
