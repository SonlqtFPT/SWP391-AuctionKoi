package swp.koi.service.googleApiService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GoogleApiServiceImpl implements GoogleApiService{

    private final RestTemplate restTemplate;

    @Override
    public String getPhoneNumber(String accessToken){
        String url = "https://people.googleapis.com/v1/people/me/connections?personFields=phoneNumbers";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        return extractPhoneNumberFromResponse(response.getBody());
    }

    private String extractPhoneNumberFromResponse(String jsonResponse){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode connections = rootNode.path("connections");

            for(JsonNode person : connections){
                JsonNode phoneNumbers = person.path("phoneNumbers");
                if(phoneNumbers.isArray() && phoneNumbers.size() > 0){
                    return phoneNumbers.get(0).path("value").asText();
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
}
