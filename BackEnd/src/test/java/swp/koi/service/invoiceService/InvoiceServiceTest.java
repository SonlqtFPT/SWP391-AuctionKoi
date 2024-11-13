package swp.koi.service.invoiceService;

import static org.junit.jupiter.api.Assertions.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Invoice;
import swp.koi.model.Lot;
import swp.koi.model.LotRegister;
import swp.koi.model.Member;
import swp.koi.model.enums.InvoiceStatusEnums;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.repository.LotRepository;
import swp.koi.repository.LotRegisterRepository;

 // Adjust the import based on your package structure
import swp.koi.service.memberService.MemberService;

import java.time.LocalDateTime;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @InjectMocks
    private InvoiceServiceImpl invoiceService; // Assuming this is the class containing createInvoiceForAuctionWinner

    @Mock
    private LotRepository lotRepository;

    @Mock
    private MemberService memberService;

    @Mock
    private LotRegisterRepository lotRegisterRepository;

    private Lot lot;
    private Member member;
    private LotRegister lotRegister;

    @BeforeEach
    public void setUp() {
        lot = new Lot();
        lot.setCurrentPrice(100.0f);
        // Set other properties as needed

        member = new Member();
        // Set member properties as needed

        lotRegister = new LotRegister();
        lotRegister.setStatus(LotRegisterStatusEnum.WON);
        // Set other properties as needed
    }

    @Test
    public void testCreateInvoiceForAuctionWinner_HappyPath() {
        // Arrange
        int lotId = 1;
        int memberId = 1;

        when(lotRepository.findById(lotId)).thenReturn(Optional.of(lot));
        when(memberService.getMemberById(memberId)).thenReturn(member);
        when(lotRegisterRepository.findByLotAndStatus(lot, LotRegisterStatusEnum.WON)).thenReturn(lotRegister);

        // Act
        Invoice invoice = invoiceService.createInvoiceForAuctionWinner(lotId, memberId);

        // Assert
        assertNotNull(invoice);
        assertEquals(LocalDateTime.now().getDayOfYear(), invoice.getInvoiceDate().getDayOfYear());
        assertEquals(10.0f, invoice.getTax()); // 10% of 100.0
        assertEquals(LocalDateTime.now().plusWeeks(1).getDayOfYear(), invoice.getDueDate().getDayOfYear());
        assertEquals(100.0f, invoice.getSubTotal());
        assertEquals(InvoiceStatusEnums.PENDING, invoice.getStatus());
        assertEquals(110.0f - lot.getDeposit(), invoice.getFinalAmount());
        assertEquals(110.0f - lot.getDeposit(), invoice.getPriceWithoutShipFee());
        assertEquals(member, invoice.getMember());
        assertEquals(lotRegister, invoice.getLotRegister());
    }

    @Test
    public void testCreateInvoiceForAuctionWinner_LotNotFound() {
        // Arrange
        int lotId = 1;
        int memberId = 1;

        when(lotRepository.findById(lotId)).thenReturn(Optional.empty());

        // Act & Assert
        KoiException exception = assertThrows(KoiException.class, () -> {
            invoiceService.createInvoiceForAuctionWinner(lotId, memberId);
        });
        assertEquals(ResponseCode.LOT_NOT_FOUND, exception.getResponseCode()); // Adjust based on your KoiException implementation
    }


}