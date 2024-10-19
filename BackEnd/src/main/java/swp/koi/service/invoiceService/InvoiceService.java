package swp.koi.service.invoiceService;

import swp.koi.model.Invoice;

import java.io.UnsupportedEncodingException;

public interface InvoiceService {

    Invoice createInvoiceForAuctionWinner();

    void updateStatusOfInvoice();

    String regeneratePaymentLinkForInvoice(int invoiceId) throws UnsupportedEncodingException;
}
