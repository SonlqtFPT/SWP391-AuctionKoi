package swp.koi.service.lotRegisterService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.LotRegisterDTO;
import swp.koi.dto.response.LotRegisterResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Lot;
import swp.koi.model.LotRegister;
import swp.koi.model.Member;
import swp.koi.model.enums.LotRegisterStatusEnum;
import swp.koi.repository.LotRegisterRepository;
import swp.koi.service.bidService.BidService;
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


    @Override
    public String regisSlotWithLotId(LotRegisterDTO lotRegisDto, HttpServletRequest request) throws UnsupportedEncodingException {
//        Lot lot = lotServiceImpl.findLotById(lotRegisDto.getLotId());
        Member member = memberServiceImpl.getMemberById(lotRegisDto.getMemberId());

        // Validate if the member is already registered for this lot
        var isUserRegisted = validateMemberRegistration(lotRegisDto.getLotId(), member);

        if(isUserRegisted) {
            return null;
        }else {
            var paymentUrl = vnpayService.generateInvoice(lotRegisDto.getLotId(),lotRegisDto.getMemberId(),request);
            return paymentUrl;
        }
        // Register the member for the lot
//        LotRegister lotRegister = createLotRegister(lot, member);
//        lotRegisterRepository.save(lotRegister);
    }

    @Override
    public List<LotRegisterResponseDTO> listLotRegistersByLotId(int lotId) throws KoiException {
        try{
            Lot lot = lotServiceImpl.findLotById(lotId);

            List<LotRegister> lotRegisters = lotRegisterRepository.findByLot(lot).orElseThrow(() -> new KoiException(ResponseCode.LOT_NOT_FOUND));

            List<LotRegisterResponseDTO> lotResponses = lotRegisters
                    .stream()
                    .map(lotRegister -> modelMapper.map(lotRegister, LotRegisterResponseDTO.class)).collect(Collectors.toList());
            return lotResponses;
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
