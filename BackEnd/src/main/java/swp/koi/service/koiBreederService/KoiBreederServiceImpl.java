package swp.koi.service.koiBreederService;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.AccountRegisterDTO;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.request.KoiBreederDTO;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Account;
import swp.koi.model.AuctionRequest;
import swp.koi.model.KoiBreeder;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.AccountRoleEnum;
import swp.koi.repository.KoiBreederRepository;
import swp.koi.service.accountService.AccountService;

import java.util.List;

@Service
public class KoiBreederServiceImpl implements KoiBreederService{

    private final KoiBreederRepository koiBreederRepository;
    private final AccountService accountService;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public KoiBreederServiceImpl(KoiBreederRepository koiBreederRepository, AccountService accountService, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.koiBreederRepository = koiBreederRepository;
        this.accountService = accountService;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public KoiBreederResponseDTO createKoiBreeder(@Valid KoiBreederDTO request) throws KoiException{
        try{
            KoiBreeder koiBreeder = new KoiBreeder();
            koiBreeder.setBreederName(request.getBreederName());
            koiBreeder.setLocation(request.getLocation());
            koiBreeder.setStatus(true);

            AccountRegisterDTO accountRegisterDTO = request.getAccount();
            Account account = new Account();
            modelMapper.map(accountRegisterDTO, account);

            account.setPassword(passwordEncoder.encode(accountRegisterDTO.getPassword()));
            account.setRole(AccountRoleEnum.BREEDER);
            account.setStatus(true);

            accountService.createAccount(account);

            koiBreeder.setAccount(account);

            KoiBreederResponseDTO breederResponse = modelMapper.map(koiBreederRepository.save(koiBreeder), KoiBreederResponseDTO.class);

            return breederResponse;
        } catch (KoiException e) {
            throw e;
        }
    }

    @Override
    public KoiBreeder findByAccount(Account account) {
        return koiBreederRepository.findByAccount(account).orElseThrow(() -> new KoiException(ResponseCode.BREEDER_NOT_FOUND));
    }

    @Override
    public KoiBreeder findByBreederId(Integer breederId) {
        return koiBreederRepository.findByBreederId(breederId).orElseThrow(() -> new KoiException(ResponseCode.BREEDER_NOT_FOUND));
    }


}
