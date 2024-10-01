package swp.koi.service.koiFishService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import swp.koi.convert.KoiFishEntityToDtoConverter;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.dto.request.KoiFishUpdateDTO;
import swp.koi.dto.request.MediaDTO;
import swp.koi.dto.request.MediaUpdateDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.*;
import swp.koi.model.enums.AuctionRequestStatusEnum;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.repository.AuctionRequestRepository;
import swp.koi.repository.KoiFishRepository;
import swp.koi.service.auctionTypeService.AuctionTypeService;
import swp.koi.service.mediaService.MediaService;
import swp.koi.service.varietyService.VarietyService;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class KoiFishServiceImpl implements KoiFishService{

    private final KoiFishRepository koiFishRepository;
    private final VarietyService varietyService;
    private final MediaService mediaService;
    private final AuctionRequestRepository auctionRequestRepository;
    private final KoiFishEntityToDtoConverter koiFishEntityToDtoConverter;
    private final AuctionTypeService auctionTypeService;
    private final ModelMapper modelMapper;

    @Override
    public KoiFish createKoiFishFromRequest(KoiFishDTO koiRequest, MediaDTO mediaRequest) throws KoiException{
            try{
                KoiFish koiFish = new KoiFish();

                // Set the variety of the koi fish by fetching it from the varietyService based on the variety name provided
                Variety variety = varietyService.findByVarietyName(koiRequest.getVarietyName());
                koiFish.setVariety(variety);

                // Create and set the media (e.g., images or videos) related to the koi fish using the mediaService
                Media media = mediaService.createMediaFromRequest(mediaRequest);
                koiFish.setMedia(media);

                AuctionType auctionType = auctionTypeService.findByAuctionTypeName(koiRequest.getAuctionTypeName());

                // Set the age, gender, price, and size from the request DTO
                koiFish.setAge(koiRequest.getAge());
                koiFish.setGender(koiRequest.getGender());
                koiFish.setAuctionType(auctionType);
                koiFish.setPrice(koiRequest.getPrice());
                koiFish.setSize(koiRequest.getSize());

                // Set the status of the koi fish to 'WAITING' (probably waiting for auction or approval)
                koiFish.setStatus(KoiFishStatusEnum.WAITING);

                // Save the koi fish to the repository and return the saved entity
                return koiFishRepository.save(koiFish);
            }catch (KoiException e){
                throw e;
            }
    }

    @Override
    public KoiFish findByFishId(Integer fishId) {
        return koiFishRepository.findByFishId(fishId).orElseThrow(() -> new KoiException(ResponseCode.FISH_NOT_FOUND));
    }

    @Override
    public List<KoiFish> getKoiFishFromApproveRequest() {
        List<AuctionRequest> auctionRequestList = auctionRequestRepository.findAllFishByStatus(AuctionRequestStatusEnum.APPROVE);

        List<KoiFish> koiFishList = auctionRequestList.stream()
                .map(AuctionRequest::getKoiFish)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return koiFishList;
    }

    @Override
    public void saveFish(KoiFish koiFish) {
        koiFishRepository.save(koiFish);
    }

    @Override
    public KoiFish updateFish(KoiFishUpdateDTO koiFishUpdateDTO, MediaUpdateDTO mediaDTO) {

        AuctionType auctionType = auctionTypeService.findByAuctionTypeName(koiFishUpdateDTO.getAuctionTypeName());

        Variety variety = varietyService.findByVarietyName(koiFishUpdateDTO.getVarietyName());

        KoiFish koiFish = koiFishRepository.findByFishId(koiFishUpdateDTO.getFishId()).orElseThrow(() -> new KoiException(ResponseCode.FISH_NOT_FOUND));

        modelMapper.map(koiFishUpdateDTO, koiFish);
        Media media = mediaService.updateMedia(mediaDTO);
        koiFish.setAuctionType(auctionType);
        koiFish.setMedia(media);
        koiFish.setVariety(variety);
        return koiFishRepository.save(koiFish);
    }
}
