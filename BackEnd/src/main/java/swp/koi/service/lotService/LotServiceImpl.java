package swp.koi.service.lotService;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.*;
import swp.koi.repository.*;
import swp.koi.service.bidService.BidServiceImpl;
import swp.koi.service.vnPayService.VnpayServiceImpl;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LotServiceImpl implements LotService {

    private final LotRepository lotRepository;
    private final BidServiceImpl bidService;
    private final LotRegisterRepository lotRegisterRepository;
    private final KoiFishRepository koiFishRepository;
    private final AuctionRepository auctionRepository;
    private final VnpayServiceImpl vnpayService;
    private final MemberRepository memberRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public Lot findLotById(int id) {
        return lotRepository.findById(id)
                .orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));
    }

    @Override
    @Async
    @Scheduled(fixedRate = 1000 * 60) // Run every 60 seconds
    public void startLotBy() {
        LocalDateTime now = LocalDateTime.now();

        List<Lot> waitingLots = lotRepository.findAllByStatusAndStartingTimeLessThan(LotStatusEnum.WAITING, now);
        waitingLots.forEach(this::startLot);

        List<Lot> runningLots = lotRepository.findAllByStatusAndEndingTimeLessThan(LotStatusEnum.AUCTIONING, now);
        runningLots.forEach(this::endLot);
    }

    private void startLot(Lot lot) {
        updateKoiFishStatus(lot.getKoiFish(), KoiFishStatusEnum.AUCTIONING);
        updateAuctionStatus(lot.getAuction(), AuctionStatusEnum.AUCTIONING);
        lot.setStatus(LotStatusEnum.AUCTIONING);
        lotRepository.save(lot);
    }

    @Override
    public void endLot(Lot lot) {
        List<Bid> bidList = bidService.listBidByLotId(lot.getLotId());

        if (bidList.isEmpty()) {
            setLotToPassed(lot);
        } else {
            concludeLot(lot, bidList);
        }
    }

    @Override
    public List<Lot> createLots(List<Lot> lots) {
        return lotRepository.saveAll(lots);
    }

    private void setLotToPassed(Lot lot) {
        updateKoiFishStatus(lot.getKoiFish(), KoiFishStatusEnum.WAITING);
        updateAuctionStatus(lot.getAuction(), AuctionStatusEnum.COMPLETED);
        lot.setStatus(LotStatusEnum.PASSED);
        lotRepository.save(lot);
    }

    private void concludeLot(Lot lot, List<Bid> bidList) {
        Bid winningBid = chooseLotWinner(lot, bidList);
        Member winningMember = winningBid.getMember();

        updateKoiFishStatus(lot.getKoiFish(), KoiFishStatusEnum.SOLD);
        updateAuctionStatus(lot.getAuction(), AuctionStatusEnum.COMPLETED);

        lot.setCurrentPrice(winningBid.getBidAmount());
        lot.setCurrentMemberId(winningMember.getMemberId());
        lot.setStatus(LotStatusEnum.SOLD);
        lotRepository.save(lot);

        updateLotRegisterStatus(lot, winningMember);
        markOtherBidsAsLost(lot, winningMember);

        createInvoiceForLot(lot, winningMember);
    }

    private void updateKoiFishStatus(KoiFish koiFish, KoiFishStatusEnum status) {
        koiFish.setStatus(status);
        koiFishRepository.save(koiFish);
    }

    private void updateAuctionStatus(Auction auction, AuctionStatusEnum status) {
        auction.setStatus(status);
        auctionRepository.save(auction);
    }

    private void updateLotRegisterStatus(Lot lot, Member member) {
        LotRegister lotRegister = lotRegisterRepository
                .findLotRegisterByLotAndMember(lot, member);
        lotRegister.setStatus(LotRegisterStatusEnum.WON);
        lotRegisterRepository.save(lotRegister);
    }

    private void markOtherBidsAsLost(Lot lot, Member winner) {
        lotRegisterRepository.findByLot(lot).ifPresent(lotRegisters -> {
            lotRegisters.stream()
                    .filter(lr -> !lr.getMember().getMemberId().equals(winner.getMemberId()))
                    .forEach(lr -> {
                        lr.setStatus(LotRegisterStatusEnum.LOSE);
                        lotRegisterRepository.save(lr);
                    });
        });
    }

    private void createInvoiceForLot(Lot lot, Member winner) {
        try {
            Invoice invoice = generateInvoice(lot.getLotId(), winner.getMemberId());
            invoiceRepository.save(invoice);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private Invoice generateInvoice(int lotId, int memberId) throws UnsupportedEncodingException {
        Lot lot = lotRepository.findById(lotId).orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new KoiException(ResponseCode.MEMBER_NOT_FOUND));

        return Invoice.builder()
                .invoiceDate(LocalDateTime.now())
                .tax((float) (lot.getCurrentPrice() * 0.1))
                .dueDate(LocalDateTime.now().plusWeeks(1))
                .subTotal(lot.getCurrentPrice())
                .paymentLink(generatePaymentLink(lot.getLotId(), member.getMemberId()))
                .lot(lot)
                .finalAmount((float) (lot.getCurrentPrice() * 1.1 - lot.getDeposit()))
                .build();
    }

    private String generatePaymentLink(int lotId, int memberId) throws UnsupportedEncodingException {
        return vnpayService.generateInvoice(lotId, memberId, TransactionTypeEnum.INVOICE_PAYMENT);
    }

    private Bid chooseLotWinner(Lot lot, List<Bid> bidList) {
        return switch (lot.getAuction().getAuctionType().getAuctionTypeName()) {
            case FIXED_PRICE_SALE -> getFixedPriceWinner(bidList);
            case SEALED_BID, ASCENDING_BID -> getHighestBid(bidList);
            case DESCENDING_BID -> getFirstBid(bidList);
        };
    }

    private Bid getFixedPriceWinner(List<Bid> bidList) {
        Collections.shuffle(bidList);
        return bidList.getFirst();
    }

    private Bid getHighestBid(List<Bid> bidList) {
        return bidList.stream()
                .max(Comparator.comparing(Bid::getBidAmount))
                .orElse(null);
    }

    private Bid getFirstBid(List<Bid> bidList) {
        return bidList.getFirst();
    }
}
