package swp.koi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.service.invoiceService.InvoiceService;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/invoice")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/regenerate-payment-link")
    public ResponseData<String> regeneratePaymentLinkForInvoice(@RequestParam("invoice-id") int invoiceId) throws UnsupportedEncodingException {
        return new ResponseData<>(ResponseCode.SUCCESS,invoiceService.regeneratePaymentLinkForInvoice(invoiceId));
    }
}
