package swp.koi.service.fireBase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

@Configuration
public class FirebaseInitializer {

    @Bean
    public FirebaseApp firebaseApp() throws IOException, FileNotFoundException {
        FileInputStream serviceAccount =
                new FileInputStream("C:\\sideProject\\SWP391-AuctionKoi\\BackEnd\\src\\main\\resources\\newproject-dc844-firebase-adminsdk-f3lur-8c4c993eaf.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://swptest-7f1bb-default-rtdb.firebaseio.com/")
                .build();

        return FirebaseApp.initializeApp(options);
    }
}

