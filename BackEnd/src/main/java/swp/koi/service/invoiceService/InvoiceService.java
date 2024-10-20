package swp.koi.service.invoiceService;

import swp.koi.model.Invoice;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface InvoiceService {

    Invoice createInvoiceForAuctionWinner();

    void updateStatusOfInvoice();

    String regeneratePaymentLinkForInvoice(int invoiceId) throws UnsupportedEncodingException;

    List<Invoice> getAllInvoicesForAuctionWinner();

    Invoice updateInvoiceAddress(double kilometer, int invoiceId, String address);

    Invoice getInvoiceForSpecificLot(int lotId);
}
