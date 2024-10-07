package swp.koi.service.auctionTypeService;

import org.springframework.stereotype.Service;
import swp.koi.dto.request.AuctionTypeDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.AuctionType;
import swp.koi.model.enums.AuctionTypeNameEnum;
import swp.koi.repository.AuctionTypeRepository;

@Service
public class AuctionTypeServiceImpl implements AuctionTypeService{

    private final AuctionTypeRepository auctionTypeRepository;

    public AuctionTypeServiceImpl(AuctionTypeRepository auctionTypeRepository) {
        this.auctionTypeRepository = auctionTypeRepository;
    }

    @Override
    public AuctionType findByAuctionTypeName(String auctionTypeName) throws KoiException{
        AuctionTypeNameEnum auctionTypeEnum;
        try{
            auctionTypeEnum = AuctionTypeNameEnum.valueOf(auctionTypeName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new KoiException(ResponseCode.AUCTION_TYPE_NOT_FOUND);
        }
        AuctionType auctionType = auctionTypeRepository.findByAuctionTypeName(auctionTypeEnum).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_TYPE_NOT_FOUND));
        return auctionType  ;
    }

    @Override
    public boolean existById(Integer auctionTypeId) {
        return auctionTypeRepository.existsById(auctionTypeId);
    }

    @Override
    public void saveType(AuctionType auctionType) {
        auctionTypeRepository.save(auctionType);
    }
}
