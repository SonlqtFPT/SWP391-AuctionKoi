package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Invoice;
import swp.koi.model.Lot;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    Invoice findByLot(Lot lot);

    List<Invoice> findAllByDueDateLessThan(LocalDateTime dateTime);
}
