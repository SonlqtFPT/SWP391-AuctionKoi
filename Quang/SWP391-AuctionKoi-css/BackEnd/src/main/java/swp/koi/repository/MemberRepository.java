package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Account;
import swp.koi.model.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {

    Member findByAccount(Account account);

}
