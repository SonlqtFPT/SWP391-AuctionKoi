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
                new FileInputStream("src/main/resources/firebasenew.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setProjectId("swptest-7f1bb")
                .build();

        return FirebaseApp.initializeApp(options);
    }
}

