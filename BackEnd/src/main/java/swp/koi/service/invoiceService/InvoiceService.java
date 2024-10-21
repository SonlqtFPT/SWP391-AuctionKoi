package swp.koi.service.invoiceService;

import swp.koi.model.Invoice;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface InvoiceService {

    Invoice createInvoiceForAuctionWinner(int lotId, int memberId);

    void updateStatusOfInvoice();

    String regeneratePaymentLinkForInvoice(int invoiceId) throws UnsupportedEncodingException;

    List<Invoice> getAllInvoicesForAuctionWinner();

    Invoice updateInvoiceAddress(double kilometer, int invoiceId, String address) throws UnsupportedEncodingException;

    Invoice getInvoiceForSpecificLot(int lotId);

    void assignStaffDelivery(Integer invoiceId, Integer accountId);
}
