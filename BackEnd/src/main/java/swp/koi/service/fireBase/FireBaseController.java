package swp.koi.service.fireBase;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class FireBaseController {

    private final FCMService fcmService;

    @GetMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestParam String title,
                                                   @RequestParam String body,
                                                   @RequestParam String token) {
        try {
            try {
                fcmService.sendPushNotification(title, body, token);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            return ResponseEntity.ok("Notification sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending notification: " + e.getMessage());
        }
    }
}
