package swp.koi.service.pdfService;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class QrCodeGeneratorService {

    public BufferedImage generateQrCode(String link) throws Exception {

        String[] parts = link.split("\\?");
        String baseUrl = parts[0];
        String query = parts.length > 1 ? parts[1] : "";

        // Encode the query parameters
        String[] queryParams = query.split("&");
        Map<String, String> encodedParams = new LinkedHashMap<>();

        for (String param : queryParams) {
            String[] keyValue = param.split("=");
            String key = keyValue[0];
            String value = keyValue.length > 1 ? keyValue[1] : "";
            // Encode only the value
            encodedParams.put(key, URLEncoder.encode(value, StandardCharsets.UTF_8.toString()));
        }

        // Reconstruct the encoded query string
        StringBuilder encodedQuery = new StringBuilder();
        for (Map.Entry<String, String> entry : encodedParams.entrySet()) {
            if (encodedQuery.length() > 0) {
                encodedQuery.append("&");
            }
            encodedQuery.append(entry.getKey()).append("=").append(entry.getValue());
        }

        // Combine base URL with encoded query string
        String encodedLink = baseUrl + "?" + encodedQuery;
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(encodedLink, BarcodeFormat.QR_CODE, 200, 200);
        BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
        return image;
    }
}
