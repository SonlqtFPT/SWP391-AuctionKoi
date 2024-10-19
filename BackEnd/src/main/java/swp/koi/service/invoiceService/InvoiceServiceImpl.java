package swp.koi.service.invoiceService;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Invoice;
import swp.koi.model.Member;
import swp.koi.model.enums.InvoiceStatusEnums;
import swp.koi.model.enums.TransactionTypeEnum;
import swp.koi.repository.InvoiceRepository;
import swp.koi.service.authService.GetUserInfoByUsingAuth;
import swp.koi.service.vnPayService.VnpayServiceImpl;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService{

    private final InvoiceRepository invoiceRepository;
    private final VnpayServiceImpl vnpayService;
    private final GetUserInfoByUsingAuth getUserInfoByUsingAuth;

    @Override
    public Invoice createInvoiceForAuctionWinner() {
        return null;
    }

    @Override
    @Scheduled(fixedRate = 1000 * 60 * 60)
    public void updateStatusOfInvoice() {
        List<Invoice> invoices = invoiceRepository.findAllByDueDateLessThanAndStatus(LocalDateTime.now(), InvoiceStatusEnums.PENDING );
        for (Invoice invoice : invoices) {
            invoice.setStatus(InvoiceStatusEnums.OVERDUE);
            invoiceRepository.save(invoice);
        }
    }

    @Override
    public String regeneratePaymentLinkForInvoice(int invoiceId) throws UnsupportedEncodingException {

        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow(() -> new KoiException(ResponseCode.TRANSACTION_NOT_FOUND));
        String paymentLink = invoice.getPaymentLink();

        String queryParams = paymentLink.split("\\?")[1];
        Map<String, String> params = new HashMap<>();
        for (String param : queryParams.split("&")) {
            String[] keyValue = param.split("=");
            params.put(keyValue[0], keyValue[1]);
        }

        // Extract the vnp_OrderInfo value
        String vnpOrderInfo = params.get("vnp_OrderInfo");

        // Decode the vnp_OrderInfo value
        String decodedVnpOrderInfo = URLDecoder.decode(vnpOrderInfo, "UTF-8");

        // Extract the individual values
        String[] values = decodedVnpOrderInfo.split("&");
        int memberId = Integer.parseInt(values[0].split("=")[1]);
        int registerLot = Integer.parseInt(values[1].split("=")[1]);
        String type = values[2].split("=")[1];

        return vnpayService.generateInvoice(registerLot,memberId, TransactionTypeEnum.valueOf(type));
    }

    @Override
    public List<Invoice> getAllInvoicesForAuctionWinner() {

        Member member = getUserInfoByUsingAuth.getMemberFromAuth();

        return invoiceRepository.findAllByStatusAndMember(InvoiceStatusEnums.PENDING,member);
    }
}
