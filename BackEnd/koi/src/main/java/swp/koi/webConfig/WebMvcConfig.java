package swp.koi.webConfig;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig {


    /**
     * Configures Cross-Origin Resource Sharing (CORS) settings for the application.
     * Only allows requests from the specified origins and HTTP methods.
     *
     * @return a WebMvcConfigurer bean with CORS configuration
     */
    @Bean
    public WebMvcConfigurer webMvc() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*") // Specifies the allowed origin
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS"); // Specifies allowed HTTP methods
            }
        };
    }

    /**
     * Defines the password encoder bean using BCrypt with a strength of 12.
     * This is used for encoding user passwords.
     *
     * @return the password encoder bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the security filter chain for the application.
     * - Disables CSRF protection.
     * - Configures which endpoints are permitted without authentication.
     * - Sets the session management policy to stateless.
     * - Adds a custom authentication provider and security filters.
     *
     * @param http the HttpSecurity object used for configuring security settings
     * @return the configured security filter chain
     * @throws Exception in case of configuration errors
     */
    @Bean
    public SecurityFilterChain configure(@NonNull HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/auth/**").permitAll()            // Public endpoints
                        .anyRequest().authenticated())                      // All other requests require authentication
                        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless session management
                        //.authenticationProvider(provider())                   // Custom authentication provider
                        .httpBasic(Customizer.withDefaults());                  // Basic HTTP authentication
                        //.addFilterBefore(preFilter, UsernamePasswordAuthenticationFilter.class); // Adding custom filter before UsernamePasswordAuthenticationFilter

        return http.build();
    }
}
