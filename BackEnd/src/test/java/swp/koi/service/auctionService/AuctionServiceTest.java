package swp.koi.service.auctionService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import swp.koi.convert.LotEntityToDtoConverter;
import swp.koi.dto.request.AuctionWithLotsDTO;
import swp.koi.dto.request.LotDTO;
import swp.koi.dto.response.AuctionResponseDTO;
import swp.koi.dto.response.LotResponseDto;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.Auction;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.repository.AuctionRepository;
import swp.koi.service.koiFishService.KoiFishService;
import swp.koi.service.lotService.LotService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class AuctionServiceTest {
    @InjectMocks
    private AuctionServiceImpl  auctionService; // Assuming this is the class containing createAuctionWithLots

    @Mock
    private KoiFishService koiFishService;

    @Mock
    private AuctionRepository auctionRepository;

    @Mock
    private LotService lotService;

    @Mock
    private LotEntityToDtoConverter lotEntityToDtoConverter;

    @Mock
    private ModelMapper modelMapper;

    private AuctionWithLotsDTO validRequest;
    private AuctionWithLotsDTO invalidRequest;

    @BeforeEach
    public void setUp() {
        // Set up a valid request
        LotDTO lotDTO = new LotDTO();
        lotDTO.setFishId(1);

        validRequest = new AuctionWithLotsDTO();
        validRequest.setStartTime(LocalDateTime.now().plusHours(1));
        validRequest.setEndTime(LocalDateTime.now().plusHours(2));
        validRequest.setLots(List.of(lotDTO));

        // Set up an invalid request (e.g., no lots provided)
        invalidRequest = new AuctionWithLotsDTO();
        invalidRequest.setStartTime(LocalDateTime.now().plusHours(1));
        invalidRequest.setEndTime(LocalDateTime.now().plusHours(2));
        invalidRequest.setLots(Collections.emptyList());
    }

    @Test
    public void testCreateAuctionWithLots_HappyPath() throws KoiException {
        // Arrange
        KoiFish koiFish = new KoiFish();
        koiFish.setFishId(1);
        koiFish.setStatus(KoiFishStatusEnum.WAITING);
        koiFish.setPrice(100.0f);
        when(koiFishService.findByFishId(1)).thenReturn(koiFish);

        Auction savedAuction = new Auction();
        when(auctionRepository.save(any(Auction.class))).thenReturn(savedAuction);

        LotResponseDto lotResponseDto = new LotResponseDto();
        when(lotEntityToDtoConverter.convertLotList(anyList())).thenReturn(List.of(lotResponseDto));

        // Act
        AuctionResponseDTO response = auctionService.createAuctionWithLots(validRequest);

        // Assert
        assertNotNull(response);
        assertEquals(savedAuction.getStartTime(), response.getStartTime());
        assertEquals(savedAuction.getEndTime(), response.getEndTime());
        assertEquals(1, response.getLots().size());
    }

}