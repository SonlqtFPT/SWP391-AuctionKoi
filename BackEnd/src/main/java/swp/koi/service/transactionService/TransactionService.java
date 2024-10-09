package swp.koi.service.transactionService;

import swp.koi.model.Transaction;

public interface TransactionService {

    Transaction createTransactionForLotDeposit(int lotId, int memberId);

    Transaction createTransactionForInvoicePayment(int lotId, int memberId);
}
