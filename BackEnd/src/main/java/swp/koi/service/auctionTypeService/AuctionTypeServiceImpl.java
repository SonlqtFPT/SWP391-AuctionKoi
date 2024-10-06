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
    public AuctionType findByAuctionTypeName(String auctionTypeName) {
        AuctionTypeNameEnum auctionTypeEnum;
        try{
            auctionTypeEnum = AuctionTypeNameEnum.valueOf(auctionTypeName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new KoiException(ResponseCode.AUCTION_TYPE_NOT_FOUND);
        }
        return auctionTypeRepository.findByAuctionTypeName(auctionTypeEnum).orElseThrow(() -> new KoiException(ResponseCode.AUCTION_TYPE_NOT_FOUND));
    }
}
