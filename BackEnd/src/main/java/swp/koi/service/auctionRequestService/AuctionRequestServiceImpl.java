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
import swp.koi.dto.response.AuctionResponseDTO;
import swp.koi.dto.response.KoiBreederResponseDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.AccountRoleEnum;
import swp.koi.model.enums.AuctionRequestStatusEnum;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.model.enums.TokenType;
import swp.koi.repository.AuctionRequestRepository;
import swp.koi.service.accountService.AccountService;
import swp.koi.service.accountService.AccountServiceImpl;
import swp.koi.service.auctionTypeService.AuctionTypeService;
import swp.koi.service.jwtService.JwtService;
import swp.koi.service.koiBreederService.KoiBreederService;
import swp.koi.service.koiBreederService.KoiBreederServiceImpl;
import swp.koi.service.koiFishService.KoiFishService;
import swp.koi.service.mediaService.MediaService;
import swp.koi.service.varietyService.VarietyService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
    private final VarietyService varietyService;
    private final MediaService mediaService;

    @Override
    public AuctionRequest createRequest(AuctionRequestDTO request) throws KoiException{
        try {
            Account account = accountService.findById(request.getAccountId());
            if(!account.getRole().equals(AccountRoleEnum.BREEDER))
                throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
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
    public List<AuctionRequest> getAllBreederRequest(Integer accountId) throws KoiException{
        try{
            Account account = accountService.findById(accountId);
            if(!account.getRole().equals(AccountRoleEnum.BREEDER))
                throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);

            List<AuctionRequest> list = auctionRequestRepository.findAllByBreederId(account.getKoiBreeder().getBreederId());
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

    @Transactional
    @Override
    public AuctionRequest updateRequest(Integer requestId, AuctionRequestUpdateDTO dto) throws KoiException{
        Account account = accountService.findById(dto.getAccountId());
        if(!account.getRole().equals(AccountRoleEnum.BREEDER))
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);

        KoiBreeder koiBreeder = koiBreederService.findByAccount(account);

        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));

        if(auctionRequest.getKoiBreeder().getBreederId() != koiBreeder.getBreederId())
            throw new KoiException(ResponseCode.WRONG_BREEDER_REQUEST);

        if(auctionRequest.getKoiBreeder() == null){
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
        }

        KoiFish koiFish = koiFishService.findByFishId(dto.getKoiFish().getFishId());
        Variety variety = varietyService.findByVarietyName(dto.getKoiFish().getVarietyName());
        Media media = mediaService.findByMediaId(dto.getKoiFish().getMedia().getMediaId());
        media.setImageUrl(dto.getKoiFish().getMedia().getImageUrl());
        media.setVideoUrl(dto.getKoiFish().getMedia().getVideoUrl());
        mediaService.save(media);
        AuctionType auctionType = auctionTypeService.findByAuctionTypeName(dto.getKoiFish().getAuctionTypeName());
        koiFish.setVariety(variety);
        koiFish.setGender(dto.getKoiFish().getGender());
        koiFish.setAge(dto.getKoiFish().getAge());
        koiFish.setSize(dto.getKoiFish().getSize());
        koiFish.setPrice(dto.getKoiFish().getPrice());
        koiFish.setAuctionType(auctionType);
        koiFish.setMedia(media);
        koiFishService.saveFish(koiFish);

        auctionRequest.setKoiFish(koiFish);
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

            if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.INSPECTION_PASSED) ||
            auctionRequest.getStatus().equals(AuctionRequestStatusEnum.PENDING_MANAGER_OFFER)){
                AuctionType auctionType = auctionTypeService.findByAuctionTypeName(request.getAuctionTypeName());
                auctionRequest.setOfferPrice(request.getOfferPrice());
                auctionRequest.setAuctionType(auctionType);
                auctionRequest.setStatus(AuctionRequestStatusEnum.PENDING_BREEDER_OFFER);
                auctionRequestRepository.save(auctionRequest);
            }else{
                throw new KoiException(ResponseCode.AUCTION_REQUEST_VALID_STATUS);
            }
    }

    @Override
    public void acceptNegotiation(Integer requestId) throws KoiException{
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
        if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.PENDING_BREEDER_OFFER) && auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.PENDING)){
            KoiFish koiFish = auctionRequest.getKoiFish();
            AuctionType auctionType = auctionRequest.getAuctionType();
            koiFish.setPrice(auctionRequest.getOfferPrice());
            koiFish.setAuctionType(auctionType);
            koiFish.setStatus(KoiFishStatusEnum.WAITING);
            koiFishService.saveFish(koiFish);

            auctionRequest.setStatus(AuctionRequestStatusEnum.APPROVE);
            auctionRequestRepository.save(auctionRequest);
        }else{
            throw new KoiException(ResponseCode.AUCTION_REQUEST_VALID_STATUS);
        }
    }

    @Override
    public void sendReNegotiation(Integer requestId, KoiFishNegotiationDTO koiFishNegotiationDTO) throws KoiException {
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));

        if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.PENDING_BREEDER_OFFER) && auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.PENDING)) {
            KoiFish koiFish = auctionRequest.getKoiFish();
            AuctionType auctionType = auctionTypeService.findByAuctionTypeName(koiFishNegotiationDTO.getAuctionTypeName());
            koiFish.setPrice(koiFishNegotiationDTO.getPrice());
            koiFish.setAuctionType(auctionType);
            koiFishService.saveFish(koiFish);
            auctionRequest.setStatus(AuctionRequestStatusEnum.PENDING_MANAGER_OFFER);
            auctionRequestRepository.save(auctionRequest);
        }else {
            throw new KoiException(ResponseCode.AUCTION_REQUEST_VALID_STATUS);
        }
    }

    @Override
    public void managerAcceptNegotiation(Integer requestId) throws KoiException{
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
        if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.PENDING_MANAGER_OFFER) && auctionRequest.getKoiFish().getStatus().equals(KoiFishStatusEnum.PENDING)){
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

    @Override
    public void managerAcceptRequest(Integer requestId) {
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
        if(auctionRequest.getStatus().equals(AuctionRequestStatusEnum.INSPECTION_PASSED)){
            KoiFish koiFish = auctionRequest.getKoiFish();
            koiFish.setStatus(KoiFishStatusEnum.WAITING);
            koiFishService.saveFish(koiFish);
            auctionRequest.setStatus(AuctionRequestStatusEnum.APPROVE);
            auctionRequestRepository.save(auctionRequest);
        }else {
            throw new KoiException(ResponseCode.FAIL);
        }
    }

    @Override
    public AuctionRequest getRequestDetail(Integer requestId) throws KoiException{
        AuctionRequest auctionRequest = auctionRequestRepository.findByRequestId(requestId).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_REQUEST_NOT_FOUND));
        return auctionRequest;
    }

    @Override
    public List<AuctionRequest> getAllPendingRequest(Integer accountId) {
        Account account = accountService.findById(accountId);
        if(account != null && account.getRole().equals(AccountRoleEnum.BREEDER))
            return auctionRequestRepository.findAllByStatusAndBreederId(AuctionRequestStatusEnum.PENDING, account.getKoiBreeder().getBreederId());
        else
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
    }

    @Override
    public List<AuctionRequest> getAllInspectionPendingRequest(Integer accountId) {
        Account account = accountService.findById(accountId);
        if(account != null && account.getRole().equals(AccountRoleEnum.BREEDER))
            return auctionRequestRepository.findAllByStatusAndBreederId(AuctionRequestStatusEnum.INSPECTION_IN_PROGRESS, account.getKoiBreeder().getBreederId());
        else
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
    }

    @Override
    public List<AuctionRequest> getAllInspectionPassedRequest(Integer accountId) {
        Account account = accountService.findById(accountId);
        if(account != null && account.getRole().equals(AccountRoleEnum.BREEDER))
            return auctionRequestRepository.findAllByStatusAndBreederId(AuctionRequestStatusEnum.INSPECTION_PASSED, account.getKoiBreeder().getBreederId());
        else
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
    }

    @Override
    public List<AuctionRequest> getAllInspectionFailedRequest(Integer accountId) {
        Account account = accountService.findById(accountId);
        if(account != null && account.getRole().equals(AccountRoleEnum.BREEDER))
            return auctionRequestRepository.findAllByStatusAndBreederId(AuctionRequestStatusEnum.INSPECTION_FAILED, account.getKoiBreeder().getBreederId());
        else
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
    }

    @Override
    public List<AuctionRequest> getAllNegotiatingRequest(Integer accountId) {
        Account account = accountService.findById(accountId);
        if(account == null || !account.getRole().equals(AccountRoleEnum.BREEDER))
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
        List<AuctionRequestStatusEnum> statues = Arrays.asList(
                AuctionRequestStatusEnum.PENDING_MANAGER_OFFER,
                AuctionRequestStatusEnum.PENDING_BREEDER_OFFER
        );
        return auctionRequestRepository.findAllByStatusInAndBreederId(statues, account.getKoiBreeder().getBreederId());
    }

    @Override
    public List<AuctionRequest> getAllApprovedRequest(Integer accountId) {
        Account account = accountService.findById(accountId);
        if(account != null && account.getRole().equals(AccountRoleEnum.BREEDER))
            return auctionRequestRepository.findAllByStatusAndBreederId(AuctionRequestStatusEnum.APPROVE, account.getKoiBreeder().getBreederId());
        else
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
    }

    @Override
    public List<AuctionRequest> getAllRejectedRequest(Integer accountId) {
        Account account = accountService.findById(accountId);
        if(account != null && account.getRole().equals(AccountRoleEnum.BREEDER))
            return auctionRequestRepository.findAllByStatusAndBreederId(AuctionRequestStatusEnum.REJECT, account.getKoiBreeder().getBreederId());
        else
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
    }

    @Override
    public List<AuctionRequest> getAllCancelledRequest(Integer accountId) {
        Account account = accountService.findById(accountId);
        if(account != null && account.getRole().equals(AccountRoleEnum.BREEDER))
            return auctionRequestRepository.findAllByStatusAndBreederId(AuctionRequestStatusEnum.CANCELLED, account.getKoiBreeder().getBreederId());
        else
            throw new KoiException(ResponseCode.BREEDER_NOT_FOUND);
    }
}
