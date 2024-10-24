package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Account;
import swp.koi.model.Invoice;
import swp.koi.model.Lot;
import swp.koi.model.Member;
import swp.koi.model.enums.InvoiceStatusEnums;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    Invoice findByLot(Lot lot);

    List<Invoice> findAllByDueDateLessThanAndStatus(LocalDateTime dateTime, InvoiceStatusEnums status);

    List<Invoice> findAllByStatusAndMember(InvoiceStatusEnums status, Member member);

    List<Invoice> findAllByAccountAndStatus(Account account, InvoiceStatusEnums status);

    List<Invoice> findAllByStatusIn(List<InvoiceStatusEnums> statues);
}
