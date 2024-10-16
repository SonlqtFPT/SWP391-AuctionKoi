package swp.koi.service.pdfService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;

@RestController
@RequestMapping("/api/qr-code")
@RequiredArgsConstructor
public class QrCodeController {

    private final QrCodeGeneratorService qrCodeGeneratorService;

    @GetMapping("/generate")
    public ResponseEntity<BufferedImage> generateQrCode(@RequestParam String link) throws Exception {
        BufferedImage qrCodeImage = qrCodeGeneratorService.generateQrCode(link);
        return ResponseEntity.ok(qrCodeImage);
    }

}
