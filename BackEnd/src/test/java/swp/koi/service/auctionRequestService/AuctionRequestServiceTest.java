package swp.koi.service.auctionRequestService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import swp.koi.dto.request.AuctionRequestDTO;
import swp.koi.dto.request.KoiFishDTO;
import swp.koi.dto.request.MediaDTO;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.AuctionRequest;
import swp.koi.model.Account;
import swp.koi.model.KoiBreeder;
import swp.koi.model.KoiFish;
import swp.koi.model.enums.AccountRoleEnum;
import swp.koi.model.enums.AuctionRequestStatusEnum;
import swp.koi.repository.AuctionRequestRepository;
import swp.koi.service.accountService.AccountServiceImpl;
import swp.koi.service.koiBreederService.KoiBreederServiceImpl;
import swp.koi.service.koiFishService.KoiFishServiceImpl;

@ExtendWith(MockitoExtension.class)
class AuctionRequestServiceTest {
    @InjectMocks
    private AuctionRequestServiceImpl auctionRequestService; // Service being tested

    @Mock
    private AccountServiceImpl accountService;

    @Mock
    private KoiBreederServiceImpl koiBreederService;

    @Mock
    private KoiFishServiceImpl koiFishService;

    @Mock
    private AuctionRequestRepository auctionRequestRepository;

    private AuctionRequestDTO validRequest;
    private Account validAccount;
    private KoiBreeder validKoiBreeder;
    private KoiFish validKoiFish;

    @BeforeEach
    public void setUp() {
        validRequest = new AuctionRequestDTO();
        validRequest.setAccountId(1);

        // Create a KoiFishDTO with a MediaDTO
        KoiFishDTO koiFishDTO = new KoiFishDTO();
        MediaDTO mediaDTO = new MediaDTO(); // Initialize MediaDTO as needed
        koiFishDTO.setMedia(mediaDTO);

        validRequest.setKoiFish(koiFishDTO); // Set the KoiFishDTO with media

        validAccount = new Account();
        validAccount.setRole(AccountRoleEnum.BREEDER);

        validKoiBreeder = new KoiBreeder();
        validKoiFish = new KoiFish();
    }

    @Test
    public void testCreateRequest_HappyPath() throws KoiException {
        // Arrange
        when(accountService.findById(1)).thenReturn(validAccount);
        when(koiBreederService.findByAccount(validAccount)).thenReturn(validKoiBreeder);
        when(koiFishService.createKoiFishFromRequest(any(KoiFishDTO.class), any(MediaDTO.class))).thenReturn(validKoiFish);

        // Create an AuctionRequest with the expected properties
        AuctionRequest expectedAuctionRequest = new AuctionRequest();
        expectedAuctionRequest.setStatus(AuctionRequestStatusEnum.REQUESTING);
        expectedAuctionRequest.setKoiBreeder(validKoiBreeder);
        expectedAuctionRequest.setKoiFish(validKoiFish);

        // Stub the repository to return the expected AuctionRequest
        when(auctionRequestRepository.save(any(AuctionRequest.class))).thenReturn(expectedAuctionRequest);

        // Act
        AuctionRequest result = auctionRequestService.createRequest(validRequest);

        // Assert
        assertNotNull(result);
        assertEquals(AuctionRequestStatusEnum.REQUESTING, result.getStatus());
        assertEquals(validKoiBreeder, result.getKoiBreeder());
        assertEquals(validKoiFish, result.getKoiFish());
    }

    @Test
    public void testCreateRequest_AccountNotBreeder() {
        // Arrange
        validAccount.setRole(AccountRoleEnum.MEMBER); // Set role to something other than BREEDER
        when(accountService.findById(1)).thenReturn(validAccount);

        // Act & Assert
        KoiException exception = assertThrows(KoiException.class, () -> {
            auctionRequestService.createRequest(validRequest);
        });
        assertEquals(ResponseCode.BREEDER_NOT_FOUND, exception.getResponseCode()); // Adjust based on your KoiException implementation
    }

    @Test
    public void testCreateRequest_KoiFishCreationFails() throws KoiException {
        // Arrange
        when(accountService.findById(1)).thenReturn(validAccount);
        when(koiBreederService.findByAccount(validAccount)).thenReturn(validKoiBreeder);
        when(koiFishService.createKoiFishFromRequest(any(KoiFishDTO.class), any(MediaDTO.class))).thenThrow(new KoiException(ResponseCode.FAIL));

        // Act & Assert
        KoiException exception = assertThrows(KoiException.class, () -> {
            auctionRequestService.createRequest(validRequest);
        });
        assertEquals("Fail", exception.getMessage());
    }
}