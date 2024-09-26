package swp.koi.service.auctionRequestService;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.dto.request.MediaDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.AuctionRequest;
import swp.koi.model.KoiBreeder;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.AuctionRequestStatusEnum;
import swp.koi.repository.AuctionRequestRepository;
import swp.koi.service.koiBreederService.KoiBreederService;
import swp.koi.service.koiBreederService.KoiBreederServiceImpl;
import swp.koi.service.koiFishService.KoiFishService;
import swp.koi.service.koiFishService.KoiFishServiceImpl;

import java.util.List;

@Service
@Transactional
public class AuctionRequestServiceImpl implements AuctionRequestService{

    private final AuctionRequestRepository auctionRequestRepository;
    private final KoiBreederService koiBreederService;
    private final KoiFishService koiFishService;

    public AuctionRequestServiceImpl(AuctionRequestRepository auctionRequestRepository, KoiBreederServiceImpl koiBreederService, KoiFishServiceImpl koiFishService) {
        this.auctionRequestRepository = auctionRequestRepository;
        this.koiBreederService = koiBreederService;
        this.koiFishService = koiFishService;
    }


    @Override
    public AuctionRequest createRequest(AuctionRequestDTO request) {
        try {
            // Create a new AuctionRequest object to hold the auction request data
            AuctionRequest auctionRequest = new AuctionRequest();

            // Retrieve the KoiFishDTO and MediaDTO from the incoming request
            KoiFishDTO koiFishDTO = request.getKoiFish();
            MediaDTO mediaDTO = request.getKoiFish().getMedia();

            // Get the KoiBreeder based on the provided breederId in the request
            KoiBreeder koiBreeder = koiBreederService.findByBreederId(request.getBreederId());
            // Create a new KoiFish object using the data from the request and media information
            KoiFish koiFish = koiFishService.createKoiFishFromRequest(koiFishDTO, mediaDTO);

            // Set the retrieved KoiBreeder, auction request status, and KoiFish in the AuctionRequest object
            auctionRequest.setKoiBreeder(koiBreeder);
            auctionRequest.setStatus(AuctionRequestStatusEnum.PENDING);
            auctionRequest.setKoiFish(koiFish);

            // Save the AuctionRequest to the repository and return the saved instance
            return auctionRequestRepository.save(auctionRequest);
        } catch (KoiException e) {
            throw new KoiException(ResponseCode.CREATED_FAILED_AUCTION_REQUEST);
        }
    }

    @Override
    public List<AuctionRequest> getAllAuctionRequest() {
        return auctionRequestRepository.findAll();
    }

}