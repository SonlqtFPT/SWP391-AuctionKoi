package swp.koi.convert;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import swp.koi.dto.response.InvoiceResponseDto;
import swp.koi.model.Invoice;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InvoiceEntityToDtoConverter {

    private final ModelMapper modelMapper;

    public List<InvoiceResponseDto> convertInvoiceList(List<Invoice> invoiceList){
        List<InvoiceResponseDto> response = invoiceList.stream()
                .map(invoice -> modelMapper.map(invoice, InvoiceResponseDto.class))
                .collect(Collectors.toList());
        return response;
    }

    public InvoiceResponseDto convertInvoiceDto(Invoice invoice){
        return modelMapper.map(invoice, InvoiceResponseDto.class);
    }

}
