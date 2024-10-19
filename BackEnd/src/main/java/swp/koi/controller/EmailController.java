package swp.koi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import swp.koi.service.mailService.EmailService;

@RestController
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    @GetMapping("/sendEmail")
    public String sendEmail(){
        emailService.sendEmail("namnguyen8644@gmail.com", "test subject", "test body");
        return "Successfully";
    }
}
