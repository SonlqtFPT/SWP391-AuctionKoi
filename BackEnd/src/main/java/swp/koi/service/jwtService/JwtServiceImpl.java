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
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import swp.koi.dto.response.ResponseCode;
import swp.koi.exception.KoiException;
import swp.koi.model.enums.TokenType;

import java.awt.*;
import java.math.BigInteger;
import java.security.Key;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;


@Service
public class JwtServiceImpl implements JwtService {
    // Secret keys used for signing tokens. These should be stored in environment variables for production.
    private final String SECRET_KEY = "921B97A9E1CD33BBD5FF5AF781C8C9C68A71B071B970B23962BD331F5D0B5720";
    private final String SECRET_KEY_FOR_REFRESH = "921B97A9E1CD33BBD5FF5AF781C8C9C68A71B071B970B23962BD331F5D0B5720ABCDE";
    private final String SECRET_KEY_FOR_RESET = "7TCuxQ2XetlAhwcNqtPyTQ1hZaJ1OwhVW4qYABJeyh8=";
    private final String KID_DEFAULT_1 = "a50f6e70ef4b548a5fd9142eecd1fb8f54dce9ee";
    private final String KID_DEFAULT_2 = "73e25f9789119c7875d58087a78ac23f5ef2eda3";
    private final String N1 = "4VI56fF0rcWHHVgHFLHrmEO5w8oN9gbSQ9TEQnlIKRg0zCtl2dLKtt0hC6WMrTA9cF7fnK4CLNkfV_Mytk-rydu2qRV_kah62v9uZmpbS5dcz5OMXmPuQdV8fDVIvscDK5dzkwD3_XJ2mzupvQN2reiYgce6-is23vwOyuT-n4vlxSqR7dWdssK5sj9mhPBEIlfbuKNykX5W6Rgu-DyuoKRc_aukWnLxWN-yoroP2IHYdCQm7Ol08vAXmrwMyDfvsmqdXUEx4om1UZ5WLf-JNaZp4lXhgF7Cur5066213jwpp4f_D3MyR-oa43fSa91gqp2berUgUyOWdYSIshABVQ";
    private final String N2 = "tMXbmw7xEDVLLkAJdxpI-6pGywn0x9fHbD_mfgtFGZEs1LDjhDAJq6c-SoODeWQstjpetTgNqVCKOuU6zGyFPNtkDjhJqDW6THy06uJ8I85crILo3h-6NPclZ3bK9OzN5bIbzjbSvxrIM7ORZOlWzByOn5qGsMvI3aDrZ0lXNC1eCDWJpoJznG1fWcHYxbUy_CHDC3Cd26jX19aRALEEQU-y-wi9pv86qxEmrYMLsVN3__eWNNPkzxgf0eSOWFDv5_19YK7irYztqiwin6abxr9RHj3Qs21hpJ9A-YfsfmNkxmifgDeiTnXpZY8yfVTCJTtkgT7sjdU1lvhsMa4Z0w";
    private final String E = "AQAB";



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

    @Override
    public String generateResetToken(String username, TokenType tokenType) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hours validity for reset token
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
        switch (tokenType){
            case ACCESS_TOKEN -> {return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());}
            case REFRESH_TOKEN -> {return Keys.hmacShaKeyFor(SECRET_KEY_FOR_REFRESH.getBytes());}
            case RESET_TOKEN -> {return Keys.hmacShaKeyFor(SECRET_KEY_FOR_RESET.getBytes());}
            default -> throw new KoiException(ResponseCode.INVALID_TOKEN_TYPE);
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

    private String extractHeader(String token){
        String[] parts = token.split("\\.");
        if(parts.length >= 2){
            return new String(Base64.getDecoder().decode(parts[0]));
        }
        throw new IllegalArgumentException("Invalid JWT token");
    }

    private String getKidFromHeader(String headerJson) throws JSONException {
        JSONObject jsonObject = new JSONObject(headerJson);
        if(jsonObject.has("kid")){
            return jsonObject.getString("kid");
        }
        throw new IllegalArgumentException("No 'kid' found in JWT header.");
    }

    private RSAPublicKey getPublicKeyByKid(String kid) throws NoSuchAlgorithmException, InvalidKeySpecException {
        String n, e;
        if(KID_DEFAULT_1.equals(kid)){
            return getPublicKeyFromJWK(N1, E);
        }else if(KID_DEFAULT_2.equals(kid)){
            return getPublicKeyFromJWK(N2, E);
        }else {
            throw new IllegalArgumentException("Unknown kid");
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
            String headerJson = extractHeader(token);
            String kid = getKidFromHeader(headerJson);

            RSAPublicKey publicKey = getPublicKeyByKid(kid);

            Algorithm algorithm = Algorithm.RSA256(publicKey, null);
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
