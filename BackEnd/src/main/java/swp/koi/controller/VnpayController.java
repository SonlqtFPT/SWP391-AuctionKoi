package swp.koi.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.service.vnPayService.VnpayService;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/pay")
@RequiredArgsConstructor
@Tag(name = "vnpay", description = "Everything about your vnpay")
public class VnpayController {

    private final VnpayService vnpayService;

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<?> vnPayResponse(HttpServletRequest request) throws UnsupportedEncodingException {

        var isResponseValid = vnpayService.isResponseValid(request);

        if (isResponseValid) {
            vnpayService.regisMemberToLot(request);
            return new ResponseEntity<>("Payment successful",HttpStatus.OK);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something went wrong with this response");
    }
}
