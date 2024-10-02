package swp.koi.service.auctionRequestService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import swp.koi.convert.AuctionRequestDtoToEntityConverter;
import swp.koi.convert.KoiFishDtoToEntitConverter;
import swp.koi.dto.request.*;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.AccountRoleEnum;
import swp.koi.model.enums.AuctionRequestStatusEnum;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.repository.AuctionRequestRepository;
import swp.koi.service.accountService.AccountService;
import swp.koi.service.auctionTypeService.AuctionTypeService;
import swp.koi.service.jwtService.JwtService;
import swp.koi.service.koiBreederService.KoiBreederService;
import swp.koi.service.koiFishService.KoiFishService;

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
    private final AuctionTypeService auctionTypeService;

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

    @Override
    public void assignStaffToRequest(Integer requestId, Integer accountId) throws KoiException{
        try{
            AuctionRequest request = auctionRequestRepository.findByRequestId(requestId)
                    .orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
            if(request.getStatus().equals(AuctionRequestStatusEnum.INSPECTION_IN_PROGRESS))
                throw new KoiException(ResponseCode.ALREADY_HAVE_STAFF);
            Account account = accountService.findById(accountId);
            if(!account.getRole().equals(AccountRoleEnum.STAFF))
                throw new KoiException(ResponseCode.MUST_BE_STAFF);
            request.setAccount(account);
            request.setStatus(AuctionRequestStatusEnum.INSPECTION_IN_PROGRESS);
            auctionRequestRepository.save(request);
        }catch (KoiException e){
            throw e;
        }
    }

    @Override
    public List<AuctionRequest> getAllStaffRequest(Integer accountId) throws KoiException{
        try{
            Account account = accountService.findById(accountId);
            if(!account.getRole().equals(AccountRoleEnum.STAFF))
                throw new KoiException(ResponseCode.MUST_BE_STAFF);
            List<AuctionRequest> list = auctionRequestRepository.findAllRequestByAccountId(accountId);
            return list;
        } catch (KoiException e) {
            throw e;
        }
    }

    @Override
    public List<AuctionRequest> getAllBreederRequest(Integer breederId) throws KoiException{
        try{
            KoiBreeder breeder = koiBreederService.findByBreederId(breederId);
            if(breeder == null)
                throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
            List<AuctionRequest> list = auctionRequestRepository.findAllByBreederId(breederId);
            return list;
        }catch (KoiException e){
            throw e;
        }
    }

    @Override
    public void breederCancelRequest(Integer requestId) throws KoiException{
        try{
            AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
            if(auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.PENDING) ||
                    auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.WAITING)) {
                KoiFish koiFish = auctionRequest.getKoiFish();
                koiFish.setStatus(KoiFishStatusEnum.CANCELLED);
                auctionRequest.setStatus(AuctionRequestStatusEnum.CANCELLED);
                auctionRequestRepository.save(auctionRequest);
            }
        }catch (KoiException e){
            throw e;
        }
    }

    @Override
    public AuctionRequest updateRequest(Integer requestId, AuctionRequestUpdateDTO dto) throws KoiException{
        KoiBreeder koiBreeder = koiBreederService.findByAccount(accountService.findById(dto.getAccountId()));
        if(koiBreeder == null){
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
        }

        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));

        KoiFishUpdateDTO koiFishDTO = dto.getKoiFish();

        auctionRequest.setKoiFish(koiFishService.updateFish(koiFishDTO));
        return auctionRequestRepository.save(auctionRequest);
    }

    @Override
    public void changeStatus(Integer requestId, UpdateStatusDTO request) {
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
        if(auctionRequest.getAccount().getRole().equals(AccountRoleEnum.STAFF)){
            auctionRequest.setStatus(request.getRequestStatus());
            auctionRequestRepository.save(auctionRequest);
        }
    }

    @Override
    public void managerNegotiation(Integer requestId, AuctionRequestNegotiationManagerDTO request) throws KoiException{
            AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));

            if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.INSPECTION_PASSED)){
                AuctionType auctionType = auctionTypeService.findByAuctionTypeName(request.getOfferAuctionType());
                auctionRequest.setOfferPrice(request.getOfferPrice());
                auctionRequest.setAuctionType(auctionType);
                auctionRequest.setStatus(AuctionRequestStatusEnum.PENDING_NEGOTIATION);
                auctionRequestRepository.save(auctionRequest);
            }else{
                throw new KoiException(ResponseCode.AUCTION_REQUEST_VALID_STATUS);
            }
    }

    @Override
    public void acceptNegotiation(Integer requestId) throws KoiException{
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
        if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.PENDING_NEGOTIATION) && auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.PENDING)){
            KoiFish koiFish = auctionRequest.getKoiFish();
            AuctionType auctionType = auctionRequest.getAuctionType();
            koiFish.setPrice(auctionRequest.getOfferPrice());
            koiFish.setAuctionType(auctionType);
            koiFish.setStatus(KoiFishStatusEnum.WAITING);
            koiFishService.saveFish(koiFish);

            auctionRequest.setStatus(AuctionRequestStatusEnum.APPROVE);
        }else{
            throw new KoiException(ResponseCode.AUCTION_REQUEST_VALID_STATUS);
        }
    }

    @Override
    public void sendReNegotiation(Integer requestId, KoiFishNegotiationDTO koiFishNegotiationDTO) throws KoiException {
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));

        if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.PENDING_NEGOTIATION) && auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.PENDING)) {
            KoiFish koiFish = auctionRequest.getKoiFish();
            AuctionType auctionType = auctionTypeService.findByAuctionTypeName(koiFishNegotiationDTO.getAuctionTypeName());
            koiFish.setPrice(koiFishNegotiationDTO.getPrice());
            koiFish.setAuctionType(auctionType);
            koiFishService.saveFish(koiFish);
        }else {
            throw new KoiException(ResponseCode.AUCTION_REQUEST_VALID_STATUS);
        }
    }

    @Override
    public void managerAcceptNegotiation(Integer requestId) throws KoiException{
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
        if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.PENDING_NEGOTIATION) && auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.PENDING)){
            KoiFish koiFish = auctionRequest.getKoiFish();
            koiFish.setStatus(KoiFishStatusEnum.WAITING);
            koiFishService.saveFish(koiFish);
            auctionRequest.setStatus(AuctionRequestStatusEnum.APPROVE);
            auctionRequestRepository.save(auctionRequest);
        }else{
            throw  new KoiException(ResponseCode.AUCTION_REQUEST_VALID_STATUS);
        }
    }

    @Override
    public void managerCancelRequest(Integer requestId) throws KoiException{
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));

        if(auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.PENDING) ||
                auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.WAITING)){
            KoiFish koiFish = auctionRequest.getKoiFish();
            koiFish.setStatus(KoiFishStatusEnum.CANCELLED);
            koiFishService.saveFish(koiFish);
            auctionRequest.setStatus(AuctionRequestStatusEnum.CANCELLED);
            auctionRequestRepository.save(auctionRequest);
        }else{
            throw new KoiException(ResponseCode.AUCTION_REQUEST_VALID_STATUS);
        }
    }
}
