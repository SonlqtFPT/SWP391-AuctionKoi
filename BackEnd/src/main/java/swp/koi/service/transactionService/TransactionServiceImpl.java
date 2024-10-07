package swp.koi.service.transactionService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Invoice;
import swp.koi.model.Lot;
import swp.koi.model.Member;
import swp.koi.model.Transaction;
import swp.koi.model.enums.TransactionTypeEnum;
import swp.koi.repository.InvoiceRepository;
import swp.koi.repository.LotRepository;
import swp.koi.repository.MemberRepository;
import swp.koi.repository.TransactionRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final LotRepository lotRepository;
    private final MemberRepository memberRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public Transaction createTransactionForLotDeposit(int lotId, int memberId) {
        Lot lot = getLot(lotId);
        Member member = getMember(memberId);

        Transaction transaction = buildTransactionForDeposit(lot, member);
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction createTransactionForInvoicePayment(int lotId, int memberId) {
        Lot lot = getLot(lotId);
        Member member = getMember(memberId);
        Invoice invoice = invoiceRepository.findByLot(lot);

        Transaction transaction = buildTransactionForInvoicePayment(lot, member, invoice);
        return transactionRepository.save(transaction);
    }

    private Lot getLot(int lotId) {
        return lotRepository.findById(lotId)
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));
    }

    private Member getMember(int memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new KoiException(ResponseCode.MEMBER_NOT_FOUND));
    }

    private Transaction buildTransactionForDeposit(Lot lot, Member member) {
        return Transaction.builder()
                .transactionType(TransactionTypeEnum.DEPOSIT)
                .transactionDate(LocalDateTime.now())
                .amount(lot.getDeposit())
                .member(member)
                .paymentStatus("SUCCESS")
                .lot(lot)
                .build();
    }

    private Transaction buildTransactionForInvoicePayment(Lot lot, Member member, Invoice invoice) {
        return Transaction.builder()
                .transactionType(TransactionTypeEnum.INVOICE_PAYMENT)
                .transactionDate(LocalDateTime.now())
                .amount(calculateInvoiceAmount(lot))
                .member(member)
                .paymentStatus("SUCCESS")
                .lot(lot)
                .invoice(invoice)
                .build();
    }

    private float calculateInvoiceAmount(Lot lot) {
        return (float) (lot.getCurrentPrice() * 1.1 - lot.getDeposit());
    }
}