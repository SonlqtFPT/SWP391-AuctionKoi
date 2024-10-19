package swp.koi.controller;


import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.dto.request.SubscribeRequestDTO;
import swp.koi.model.Member;
import swp.koi.model.SubscribeRequest;
import swp.koi.service.authService.GetUserInfoByUsingAuth;
import swp.koi.service.redisService.RedisServiceImpl;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
@Tag(name = "notification", description = "Everything about your notification")
public class NotificationController {

    private final RedisServiceImpl redisService;
    private final GetUserInfoByUsingAuth authService;

    @PostMapping("/subscribe")
    public ResponseEntity<String> saveFcmToken(@RequestBody SubscribeRequestDTO subscribeRequestDTO){
        try {
            if (subscribeRequestDTO == null) {
                return ResponseEntity.badRequest().body("Invalid request body");
            }
            Member member = authService.getMemberFromAuth();
            SubscribeRequest subInfo = SubscribeRequest.builder()
                    .token(subscribeRequestDTO.getToken())
                    .memberId(member.getMemberId())
                    .build();
            redisService.saveDataToSet("Notify_"+subscribeRequestDTO.getLotId(), subInfo);
            return ResponseEntity.ok("Token saved successfully");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
