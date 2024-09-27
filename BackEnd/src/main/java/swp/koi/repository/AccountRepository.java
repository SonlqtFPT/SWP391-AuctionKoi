package swp.koi.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.model.Account;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<AccountRegisterDTO> findByAccountId(Integer accountId);
    Optional<Account> findByEmail(String email);

    boolean existsByEmail(String email);
}
