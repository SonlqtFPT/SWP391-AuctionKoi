package swp.koi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.convert.InvoiceEntityToDtoConverter;
import swp.koi.dto.response.InvoiceResponseDto;
import swp.koi.dto.response.ResponseCode;
import swp.koi.dto.response.ResponseData;
import swp.koi.exception.KoiException;
import swp.koi.model.Invoice;
import swp.koi.service.invoiceService.InvoiceService;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/invoice")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoiceEntityToDtoConverter invoiceEntityToDtoConverter;

    @GetMapping("/regenerate-payment-link")
    public ResponseData<String> regeneratePaymentLinkForInvoice(@RequestParam("invoice-id") int invoiceId) throws UnsupportedEncodingException {
        try {
            return new ResponseData<>(ResponseCode.SUCCESS,invoiceService.regeneratePaymentLinkForInvoice(invoiceId));
        } catch (KoiException e) {
            throw new KoiException(ResponseCode.TRANSACTION_NOT_FOUND);
        }
    }

    @GetMapping("/get-invoices")
    public ResponseData<List<InvoiceResponseDto>> getAllInvoicesOfMember() {
        try {
            List<InvoiceResponseDto> response = invoiceEntityToDtoConverter.convertInvoiceList(invoiceService.getAllInvoicesForAuctionWinner());
            return new ResponseData<>(ResponseCode.SUCCESS, response);
        } catch (KoiException e) {
            throw new KoiException(ResponseCode.MEMBER_NOT_FOUND);
        }
    }
}
