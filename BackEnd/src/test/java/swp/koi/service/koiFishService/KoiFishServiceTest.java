package swp.koi.service.koiFishService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.dto.request.MediaDTO;
import swp.koi.exception.KoiException;
import swp.koi.model.AuctionType;
import swp.koi.model.KoiFish;
import swp.koi.model.Media;
import swp.koi.model.Variety;
import swp.koi.model.enums.KoiFishStatusEnum;
import swp.koi.repository.KoiFishRepository;
import swp.koi.service.auctionTypeService.AuctionTypeService;
import swp.koi.service.mediaService.MediaService;
import swp.koi.service.varietyService.VarietyService;

@ExtendWith(MockitoExtension.class)
class KoiFishServiceTest {

    @InjectMocks
    private KoiFishServiceImpl koiFishService; // Assuming this is the class containing createKoiFishFromRequest

    @Mock
    private VarietyService varietyService;

    @Mock
    private MediaService mediaService;

    @Mock
    private AuctionTypeService auctionTypeService;

    @Mock
    private KoiFishRepository koiFishRepository;

    private KoiFishDTO validKoiRequest;
    private MediaDTO validMediaRequest;

    @BeforeEach
    public void setUp() {
        validKoiRequest = new KoiFishDTO();
        validKoiRequest.setVarietyName("kohaku");
        validKoiRequest.setAge(2);
        validKoiRequest.setGender("Male");
        validKoiRequest.setAuctionTypeName("Auction Type");
        validKoiRequest.setPrice(100.0f);
        validKoiRequest.setSize(30);

        validMediaRequest = new MediaDTO();
        // Set up media properties as needed
    }

    @Test
    public void testCreateKoiFishFromRequest_HappyPath() throws KoiException {
        // Arrange
        Variety variety = new Variety();
        variety.setVarietyName("kohaku"); // Set the variety name
        when(varietyService.findByVarietyName("kohaku")).thenReturn(variety);


        Media media = new Media();
        when(mediaService.createMediaFromRequest(validMediaRequest)).thenReturn(media);

        AuctionType auctionType = new AuctionType();
        when(auctionTypeService.findByAuctionTypeName("Auction Type")).thenReturn(auctionType);

        KoiFish savedKoiFish = new KoiFish();
        when(koiFishRepository.save(any(KoiFish.class))).thenReturn(savedKoiFish);

        // Act
        KoiFish result = koiFishService.createKoiFishFromRequest(validKoiRequest, validMediaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(savedKoiFish, result);
        assertEquals(variety.getVarietyName(), result.getVariety().getVarietyName());
        assertEquals(media, result.getMedia());
        assertEquals(auctionType, result.getAuctionType());
        assertEquals(2, result.getAge());
        assertEquals("Male", result.getGender());
        assertEquals(100.0f, result.getPrice());
        assertEquals(30, result.getSize());
        assertEquals(KoiFishStatusEnum.PENDING, result.getStatus());
    }

    @Test
    public void testCreateKoiFishFromRequest_VarietyNotFound() {
        // Arrange
        when(varietyService.findByVarietyName("Koi Variety")).thenReturn(null);

        // Act & Assert
        KoiException exception = assertThrows(KoiException.class, () -> {
            koiFishService.createKoiFishFromRequest(validKoiRequest, validMediaRequest);
        });
        assertEquals("Expected exception message or code", exception.getMessage()); // Adjust based on your KoiException implementation
    }

    // Additional tests can be added for other unhappy paths
}