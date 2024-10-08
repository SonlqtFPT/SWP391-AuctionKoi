package swp.koi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KoiFishApplication {

	public static void main(String[] args) {
		SpringApplication.run(KoiFishApplication.class, args);
	}

}
