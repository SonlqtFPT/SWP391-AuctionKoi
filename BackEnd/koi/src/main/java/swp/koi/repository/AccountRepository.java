package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import swp.koi.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {
}
