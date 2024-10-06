package swp.koi.service.transactionService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Lot;
import swp.koi.model.Member;
import swp.koi.model.Transaction;
import swp.koi.model.enums.TransactionTypeEnum;
import swp.koi.repository.LotRepository;
import swp.koi.repository.MemberRepository;
import swp.koi.repository.TransactionRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{

    private final TransactionRepository transactionRepository;
    private final LotRepository lotRepository;
    private final MemberRepository memberRepository;

    @Override
    public Transaction createTransactionForLotDeposit(int lotId, int memberId) {

        Lot lot = lotRepository.findById(lotId).orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

        Member member = memberRepository.findById(memberId).orElseThrow(() -> new KoiException(ResponseCode.MEMBER_NOT_FOUND));

        Transaction transaction = Transaction.builder()
                .transactionType(TransactionTypeEnum.DEPOSIT)
                .transactionDate(LocalDateTime.now())
                .amount(lot.getDeposit())
                .member(member)
                .paymentStatus("SUCCESSFUL")
                .build();

        return transactionRepository.save(transaction);
    }
}
