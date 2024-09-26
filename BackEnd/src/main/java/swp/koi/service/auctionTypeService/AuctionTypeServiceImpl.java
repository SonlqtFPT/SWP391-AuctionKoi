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
        AuctionTypeNameEnum auctionTypeEnum = AuctionTypeNameEnum.valueOf(auctionTypeName.toUpperCase());
        return auctionTypeRepository.findByAuctionTypeName(auctionTypeEnum).orElseThrow(() -> new KoiException(ResponseCode.NOT_FOUND));
    }
}
