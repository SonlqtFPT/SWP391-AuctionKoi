package swp.koi.service.auctionRequestService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import swp.koi.convert.AuctionRequestDtoToEntityConverter;
import swp.koi.convert.AuctionRequestEntityToDtoConverter;
import swp.koi.convert.KoiFishDtoToEntitConverter;
import swp.koi.dto.request.*;
import swp.koi.dto.response.AuctionRequestResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Account;
import swp.koi.model.AuctionRequest;
import swp.koi.model.KoiBreeder;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.AuctionRequestStatusEnum;
import swp.koi.model.enums.TokenType;
import swp.koi.repository.AuctionRequestRepository;
import swp.koi.service.accountService.AccountService;
import swp.koi.service.accountService.AccountServiceImpl;
import swp.koi.service.jwtService.JwtService;
import swp.koi.service.koiBreederService.KoiBreederService;
import swp.koi.service.koiBreederService.KoiBreederServiceImpl;
import swp.koi.service.koiFishService.KoiFishService;
import swp.koi.service.koiFishService.KoiFishServiceImpl;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AuctionRequestServiceImpl implements AuctionRequestService{

    private final AuctionRequestRepository auctionRequestRepository;
    private final KoiBreederService koiBreederService;
    private final KoiFishService koiFishService;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final AccountService accountService;
    private final AuctionRequestDtoToEntityConverter auctionRequestDtoToEntityConverter;
    private final KoiFishDtoToEntitConverter koiFishDtoToEntitConverter;

    @Override
    public AuctionRequest createRequest(AuctionRequestDTO request) throws KoiException{
        try {
            Account account = accountService.findById(request.getAccountId());
            // Create a new AuctionRequest object to hold the auction request data
            AuctionRequest auctionRequest = new AuctionRequest();

            // Retrieve the KoiFishDTO and MediaDTO from the incoming request
            KoiFishDTO koiFishDTO = request.getKoiFish();
            MediaDTO mediaDTO = request.getKoiFish().getMedia();

            // Get the KoiBreeder based on the provided breederId in the request
            KoiBreeder koiBreeder = koiBreederService.findByAccount(account);
            // Create a new KoiFish object using the data from the request and media information
            KoiFish koiFish = koiFishService.createKoiFishFromRequest(koiFishDTO, mediaDTO);

            // Set the retrieved KoiBreeder, auction request status, and KoiFish in the AuctionRequest object
            auctionRequest.setKoiBreeder(koiBreeder);
            auctionRequest.setStatus(AuctionRequestStatusEnum.PENDING);
            auctionRequest.setKoiFish(koiFish);

            // Save the AuctionRequest to the repository and return the saved instance
            return auctionRequestRepository.save(auctionRequest);
        } catch (KoiException e) {
            throw e;
        }
    }

    @Override
    public List<AuctionRequest> getAllAuctionRequest() {
        return auctionRequestRepository.findAll();
    }

    @Override
    public AuctionRequest findByRequestId(Integer requestId) {
        return auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
    }

    @Override
    public void saveRequest(AuctionRequest auctionRequest) {
        auctionRequestRepository.save(auctionRequest);
    }

}
