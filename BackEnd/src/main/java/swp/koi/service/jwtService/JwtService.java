package swp.koi.service.jwtService;

import org.springframework.security.core.userdetails.UserDetails;
import swp.koi.model.enums.TokenType;

import java.security.Key;

public interface JwtService {

    String generateToken(String username, TokenType tokenType);

    String generateRefreshToken(String username, TokenType tokenType);

    Key getKey(TokenType tokenType);

    boolean validateToken(String token, UserDetails userDetails, TokenType tokenType);

    String extractUsername(String token, TokenType tokenType);

}
