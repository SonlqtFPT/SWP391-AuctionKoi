package swp.koi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
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
@Tag(name = "invoice", description = "Everything about your invoice")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoiceEntityToDtoConverter invoiceEntityToDtoConverter;

    @Operation(summary = "Regenerate payment link incase old payment link is expired")
    @GetMapping("/regenerate-payment-link")
    public ResponseData<String> regeneratePaymentLinkForInvoice(@RequestParam("invoice-id") int invoiceId) throws UnsupportedEncodingException {
        try {
            return new ResponseData<>(ResponseCode.SUCCESS,invoiceService.regeneratePaymentLinkForInvoice(invoiceId));
        } catch (KoiException e) {
            throw new KoiException(ResponseCode.TRANSACTION_NOT_FOUND);
        }
    }

    @Operation(summary = "Get list of invoices that to be pay for user")
    @GetMapping("/get-invoices")
    public ResponseData<List<InvoiceResponseDto>> getAllInvoicesOfMember() {
        try {
            List<InvoiceResponseDto> response = invoiceEntityToDtoConverter.convertInvoiceList(invoiceService.getAllInvoicesForAuctionWinner());
            return new ResponseData<>(ResponseCode.SUCCESS, response);
        } catch (KoiException e) {
            throw new KoiException(ResponseCode.MEMBER_NOT_FOUND);
        }
    }

    @Operation(summary = "Update invoice with shipping address and distance")
    @PatchMapping("/update-invoice")
    public ResponseData<Invoice> updateInvoice(@RequestParam double kilometer,
                                               @RequestParam int invoiceId,
                                               @RequestParam String address) {
        try {
            return new ResponseData<>(ResponseCode.SUCCESS,invoiceService.updateInvoiceAddress(kilometer, invoiceId, address));
        } catch (KoiException e) {
            throw new KoiException(ResponseCode.LOT_NOT_FOUND);
        }
    }

    @Operation(summary = "Get invoice for specific lot")
    @GetMapping("/get-invoice")
    public ResponseData<?> getInvoiceForSpecificLot(@RequestParam int lotId){
        try {
            InvoiceResponseDto response = invoiceEntityToDtoConverter.convertInvoiceDto(invoiceService.getInvoiceForSpecificLot(lotId));
            return new ResponseData<>(ResponseCode.SUCCESS,response);
        } catch (KoiException e) {
            throw new KoiException(e.getResponseCode());
        }
    }
}
