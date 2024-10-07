package swp.koi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.koi.model.Invoice;
import swp.koi.model.Lot;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    Invoice findByLot(Lot lot);

}
