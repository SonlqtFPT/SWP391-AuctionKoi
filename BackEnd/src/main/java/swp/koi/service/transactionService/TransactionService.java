package swp.koi.service.transactionService;

import swp.koi.model.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransactionForLotDeposit(int lotId, int memberId);

    Transaction createTransactionForInvoicePayment(int lotId, int memberId);

    List<Transaction> getAllTransaction();
}
