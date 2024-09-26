package swp.koi.service.lotRegisterService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.requestDto.LotRegisDto;
import swp.koi.model.Lot;
import swp.koi.model.LotRegister;
import swp.koi.model.Member;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.repository.LotRegisterRepository;
import swp.koi.service.lotService.LotServiceImpl;
import swp.koi.service.memberService.MemberServiceImpl;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class LotRegisterServiceImpl implements LotRegisterService{

    private final LotRegisterRepository lotRegisterRepository;
    private final LotServiceImpl lotServiceImpl;
    private final MemberServiceImpl memberServiceImpl;

    @Override
    public void regisSlotWithLotId(LotRegisDto lotRegisDto) {
        Lot lot = lotServiceImpl.findLotById(lotRegisDto.getLotId());
        Member member = memberServiceImpl.getMemberById(lotRegisDto.getMemberId());

        // Validate if the member is already registered for this lot
        validateMemberRegistration(lotRegisDto.getLotId(), member);

        // Register the member for the lot
        LotRegister lotRegister = createLotRegister(lot, member);
        lotRegisterRepository.save(lotRegister);
    }

    @Override
    public List<LotRegister> listLotRegistersByLotId(int lotId) {

        Lot lot = lotServiceImpl.findLotById(lotId);

        return lotRegisterRepository.findByLot(lot).orElseThrow(() -> new NoSuchElementException("lotId not exist"));
    }

    private void validateMemberRegistration(Integer lotId, Member member) {
        boolean isAlreadyRegistered = listLotRegistersByLotId(lotId)
                .stream()
                .anyMatch(lr -> lr.getMember().equals(member));

        if (isAlreadyRegistered) {
            throw new IllegalStateException("Member already registered");
        }
    }

    private LotRegister createLotRegister(Lot lot, Member member) {
        return LotRegister.builder()
                .deposit(lot.getDeposit())
                .status(LotRegisterStatusEnum.WAITING)
                .member(member)
                .lot(lot)
                .build();
    }
}
