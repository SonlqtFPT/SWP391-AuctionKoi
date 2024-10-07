package swp.koi.service.lotRegisterService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.LotRegisterDTO;
import swp.koi.dto.response.LotRegisterResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Lot;
import swp.koi.model.LotRegister;
import swp.koi.model.Member;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.model.enums.TransactionTypeEnum;
import swp.koi.repository.AccountRepository;
import swp.koi.repository.LotRegisterRepository;
import swp.koi.service.lotService.LotServiceImpl;
import swp.koi.service.memberService.MemberServiceImpl;
import swp.koi.service.vnPayService.VnpayService;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LotRegisterServiceImpl implements LotRegisterService{

    private final LotRegisterRepository lotRegisterRepository;
    private final LotServiceImpl lotServiceImpl;
    private final MemberServiceImpl memberServiceImpl;
    private final ModelMapper modelMapper;
    private final VnpayService vnpayService;
    private final AccountRepository accountRepository;


    /**
     *
     * @param lotRegisDto
     * @param request
     * @return
     * @throws UnsupportedEncodingException
     */
    @Override
    public String regisSlotWithLotId(LotRegisterDTO lotRegisDto,
                                     HttpServletRequest request) throws UnsupportedEncodingException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        Member member = memberServiceImpl.getMemberByAccount(accountRepository.findByEmail(username)
        .orElseThrow(() -> new KoiException(ResponseCode.MEMBER_NOT_FOUND)));


        // Validate if the member is already registered for this lot
        var isUserRegistered = validateMemberRegistration(lotRegisDto.getLotId(), member);

        if(isUserRegistered) {
            throw new KoiException((ResponseCode.MEMBER_ALREADY_REGISTERED));
        }
        return vnpayService.generateInvoice(lotRegisDto.getLotId(),member.getMemberId(), TransactionTypeEnum.DEPOSIT);

    }

    @Override
    public List<LotRegisterResponseDTO> listLotRegistersByLotId(int lotId) throws KoiException {
        try{
            Lot lot = lotServiceImpl.findLotById(lotId);

            List<LotRegister> lotRegisters = lotRegisterRepository.findByLot(lot).orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

            return lotRegisters
                    .stream()
                    .map(lotRegister -> modelMapper.map(lotRegister, LotRegisterResponseDTO.class)).collect(Collectors.toList());
        }catch (KoiException e){
            throw e;
        }
    }

    private boolean validateMemberRegistration(Integer lotId, Member member){

        return listLotRegistersByLotId(lotId)
                .stream()
                .anyMatch(lr -> lr.getMember().equals(member));

    }

    public LotRegister createLotRegister(Lot lot, Member member) {
        return LotRegister.builder()
                .deposit(lot.getDeposit())
                .status(LotRegisterStatusEnum.WAITING)
                .member(member)
                .lot(lot)
                .build();
    }
}
