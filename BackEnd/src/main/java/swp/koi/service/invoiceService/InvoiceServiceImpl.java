package swp.koi.service.invoiceService;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Invoice;
import swp.koi.model.Lot;
import swp.koi.model.Member;
import swp.koi.model.enums.InvoiceStatusEnums;
import swp.koi.model.enums.TransactionTypeEnum;
import swp.koi.repository.InvoiceRepository;
import swp.koi.service.authService.GetUserInfoByUsingAuth;
import swp.koi.service.lotService.LotService;
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
    private final LotService lotService;

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

    @Override
    public Invoice updateInvoiceAddress(double kilometer, int invoiceId, String address){

        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

        invoice.setAddress(address);
        invoice.setKilometers(kilometer);

        float currentPrice = invoice.getFinalAmount();
        float newPriceWithAddress = generateShippingPriceForInvoice(kilometer);
        float newPrice = currentPrice + newPriceWithAddress;

        invoice.setFinalAmount(newPrice);
        return invoiceRepository.save(invoice);
    }

    private float generateShippingPriceForInvoice(double kilometer) {
        float pricePerKm = pricePerKilometer(kilometer);
        return (float) (pricePerKm * kilometer);
    }

    private float pricePerKilometer(double kilometer) {
        int pricePerKm = 0;
        
        if (kilometer >= 11 && kilometer <= 50) {
            pricePerKm = 1500;
        } else if (kilometer >= 51 && kilometer <= 100) {
            pricePerKm = 1200;
        } else if (kilometer >= 101 && kilometer <= 200) {
            pricePerKm = 1000;
        } else if (kilometer > 200) {
            pricePerKm = 800;
        } else {
            throw new IllegalStateException("Kilometers must greater than 0"); // Invalid distance
        }
        
        return pricePerKm;
    }

    @Override
    public Invoice getInvoiceForSpecificLot(int lotId) {
        try {
            Lot lot = lotService.findLotById(lotId);
            return invoiceRepository.findByLot(lot);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
