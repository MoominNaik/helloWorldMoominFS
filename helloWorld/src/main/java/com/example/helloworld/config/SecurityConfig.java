package com.example.helloworld.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
        "/",
        "/index.html",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/api/users/register",
        "/api/users/login",
        "/api/users/logout",
        "/api/users",
        "/api/posts/**",
        "/api/profile/**",  // Allow public access to profile endpoints
        "/api/uploads",     // Allow image upload without auth (adjust if needed)
        "/uploads/**"       // Allow serving static uploaded files
    };

    private static final String[] AUTHENTICATED_ENDPOINTS = {
        "/api/users/me",
        "/api/chat/**"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Global CORS configuration
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:3000",
                        "http://10.109.206.114:3000",
                        "http://127.0.0.1:3000"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    .allowedHeaders("*")
                    .exposedHeaders("Authorization")  // Expose Authorization header
                    .allowCredentials(true)
                    .maxAge(3600);  // Cache preflight request for 1 hour
            }
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http.cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                // Always allow preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Authenticated endpoints
                .requestMatchers(AUTHENTICATED_ENDPOINTS).authenticated()
                // Secure all other endpoints by default
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
