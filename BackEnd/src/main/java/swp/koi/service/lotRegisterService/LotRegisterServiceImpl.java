package swp.koi.service.lotRegisterService;

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
import swp.koi.service.lotService.LotServiceImpl;
import swp.koi.service.memberService.MemberServiceImpl;

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

    @Override
    public void regisSlotWithLotId(LotRegisterDTO lotRegisterDTO) throws KoiException{
        try{
            Lot lot = lotServiceImpl.findLotById(lotRegisterDTO.getLotId());
            Member member = memberServiceImpl.getMemberById(lotRegisterDTO.getMemberId());

            // Validate if the member is already registered for this lot
            validateMemberRegistration(lotRegisterDTO.getLotId(), member);

            // Register the member for the lot
            LotRegister lotRegister = createLotRegister(lot, member);
            lotRegisterRepository.save(lotRegister);
        }catch (KoiException e){
            throw e;
        }
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

    private void validateMemberRegistration(Integer lotId, Member member) throws KoiException{
        try{
            boolean isAlreadyRegistered = listLotRegistersByLotId(lotId)
                    .stream()
                    .anyMatch(lr -> lr.getMember().equals(member));

            if (isAlreadyRegistered) {
                throw new KoiException(ResponseCode.MEMBER_REGISTED);
            }
        }catch (KoiException e){
            throw e;
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
