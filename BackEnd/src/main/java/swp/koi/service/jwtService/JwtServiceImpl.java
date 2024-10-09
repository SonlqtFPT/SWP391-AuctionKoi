package swp.koi.service.jwtService;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.util.Base64URL;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.enums.TokenType;

import java.math.BigInteger;
import java.security.Key;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPublicKeySpec;
import java.util.Date;
import java.util.function.Function;


@Service
public class JwtServiceImpl implements JwtService {
    // Secret keys used for signing tokens. These should be stored in environment variables for production.
    private final String SECRET_KEY = "921B97A9E1CD33BBD5FF5AF781C8C9C68A71B071B970B23962BD331F5D0B5720";
    private final String SECRET_KEY_FOR_REFRESH = "921B97A9E1CD33BBD5FF5AF781C8C9C68A71B071B970B23962BD331F5D0B5720ABCDE";
    private static final String n = "4VI56fF0rcWHHVgHFLHrmEO5w8oN9gbSQ9TEQnlIKRg0zCtl2dLKtt0hC6WMrTA9cF7fnK4CLNkfV_Mytk-rydu2qRV_kah62v9uZmpbS5dcz5OMXmPuQdV8fDVIvscDK5dzkwD3_XJ2mzupvQN2reiYgce6-is23vwOyuT-n4vlxSqR7dWdssK5sj9mhPBEIlfbuKNykX5W6Rgu-DyuoKRc_aukWnLxWN-yoroP2IHYdCQm7Ol08vAXmrwMyDfvsmqdXUEx4om1UZ5WLf-JNaZp4lXhgF7Cur5066213jwpp4f_D3MyR-oa43fSa91gqp2berUgUyOWdYSIshABVQ";
    private static final String e = "AQAB";

    /**
     * Generates a JWT access token for the given username and token type.
     *
     * @param username  the username to be embedded in the token
     * @param tokenType the type of token (access or refresh)
     * @return the generated JWT token
     */
    @Override
    public String generateToken(String username, TokenType tokenType) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours validity for access token
                .signWith(getKey(tokenType))
                .compact();
    }

    /**
     * Generates a JWT refresh token for the given username and token type.
     *
     * @param username  the username to be embedded in the token
     * @param tokenType the type of token (refresh)
     * @return the generated JWT refresh token
     */
    @Override
    public String generateRefreshToken(String username, TokenType tokenType) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 15)) // 15 days validity for refresh token
                .signWith(getKey(tokenType))
                .compact();
    }

    /**
     * Retrieves the appropriate secret key for the given token type.
     *
     * @param tokenType the type of token (access or refresh)
     * @return the secret key used for signing the token
     */
    @Override
    public Key getKey(TokenType tokenType) {
        if (tokenType.equals(TokenType.ACCESS_TOKEN)) {
            return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        } else {
            return Keys.hmacShaKeyFor(SECRET_KEY_FOR_REFRESH.getBytes());
        }
    }

    /**
     * Validates the given JWT token by checking its username and expiration.
     *
     * @param token       the JWT token to validate
     * @param userDetails the user details to match against the token's subject
     * @param tokenType   the type of token (access or refresh)
     * @return true if the token is valid, false otherwise
     */
    @Override
    public boolean validateToken(String token, UserDetails userDetails, TokenType tokenType) {
        try {
            final String username = extractUsername(token, tokenType);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token, tokenType);
        } catch (KoiException e) {
            throw new KoiException(ResponseCode.JWT_INVALID);
        }
    }

    /**
     * Extracts the username from the given JWT token.
     *
     * @param token     the JWT token
     * @param tokenType the type of token (access or refresh)
     * @return the username embedded in the token
     */
    @Override
    public String extractUsername(String token, TokenType tokenType) {
        return extractClaim(token, Claims::getSubject, tokenType);
    }

    /**
     * Checks if the given token is expired.
     *
     * @param token     the JWT token
     * @param tokenType the type of token (access or refresh)
     * @return true if the token is expired, false otherwise
     */
    private boolean isTokenExpired(String token, TokenType tokenType) {
        return extractExpiration(token, tokenType).before(new Date());
    }

    /**
     * Extracts the expiration date from the given token.
     *
     * @param token     the JWT token
     * @param tokenType the type of token (access or refresh)
     * @return the expiration date of the token
     */
    private Date extractExpiration(String token, TokenType tokenType) {
        return extractClaim(token, Claims::getExpiration, tokenType);
    }

    /**
     * Extracts a specific claim from the given token using a function to resolve the claim.
     *
     * @param token          the JWT token
     * @param claimsResolver a function that resolves the desired claim from the token's claims
     * @param tokenType      the type of token (access or refresh)
     * @param <T>            the type of the claim to be returned
     * @return the extracted claim
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver, TokenType tokenType) throws KoiException {
        try {
            final Claims claims = extractAllClaims(token, tokenType);
            return claimsResolver.apply(claims);
        } catch (KoiException e) {
            throw new KoiException(ResponseCode.JWT_INVALID);
        }
    }

    /**
     * Extracts all claims from the given JWT token.
     *
     * @param token     the JWT token
     * @param tokenType the type of token (access or refresh)
     * @return the claims embedded in the token
     */
    private Claims extractAllClaims(String token, TokenType tokenType) throws KoiException {
        try {
            return Jwts.parser()
                    .setSigningKey(getKey(tokenType))
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException | IllegalArgumentException | SignatureException | MalformedJwtException |
                 UnsupportedJwtException e) {
            throw new KoiException(ResponseCode.JWT_INVALID);
        }
    }

    private static RSAPublicKey getPublicKeyFromJWK(String n, String e) throws NoSuchAlgorithmException, InvalidKeySpecException {
        BigInteger modulus = new BigInteger(1, Base64URL.from(n).decode());
        BigInteger exponent = new BigInteger(1, Base64URL.from(e).decode());

        RSAPublicKeySpec publicKeySpec = new RSAPublicKeySpec(modulus, exponent);

        KeyFactory keyFactory = KeyFactory.getInstance("RSA");

        RSAPublicKey publicKey = (RSAPublicKey) keyFactory.generatePublic(publicKeySpec);

        return publicKey;
    }

    public DecodedJWT verifyToken(String token) {
        try{
            Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) getPublicKeyFromJWK(n, e), null);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer("https://accounts.google.com")
                    .build();

            DecodedJWT decodedJWT = verifier.verify(token);
            return decodedJWT;
        }catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
