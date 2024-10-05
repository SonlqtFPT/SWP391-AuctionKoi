package swp.koi.service.mailService;

public interface EmailService {

    void sendEmail(String to, String subject, String body);

}
