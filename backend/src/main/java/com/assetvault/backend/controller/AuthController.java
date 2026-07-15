package com.assetvault.backend.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.assetvault.backend.model.ERole;
import com.assetvault.backend.model.Role;
import com.assetvault.backend.model.User;
import com.assetvault.backend.payload.request.LoginRequest;
import com.assetvault.backend.payload.request.SignupRequest;
import com.assetvault.backend.payload.response.JwtResponse;
import com.assetvault.backend.payload.response.MessageResponse;
import com.assetvault.backend.repository.RoleRepository;
import com.assetvault.backend.repository.UserRepository;
import com.assetvault.backend.security.jwt.JwtUtils;
import com.assetvault.backend.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(), 
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    // Unconditionally assign ROLE_USER to all new users
    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    roles.add(userRole);

    if (strRoles != null) {
      strRoles.forEach(role -> {
        if ("admin".equals(role)) {
          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  // --- FORGOT PASSWORD IMPLEMENTATION ---
  
  private static class OtpData {
      String otp;
      long expiryTime;
      OtpData(String otp, long expiryTime) {
          this.otp = otp;
          this.expiryTime = expiryTime;
      }
  }

  // In-memory cache for OTPs (email -> OtpData). For production, use Redis or DB.
  private java.util.Map<String, OtpData> otpCache = new java.util.concurrent.ConcurrentHashMap<>();

  private void cleanUpOtpCache() {
      long now = System.currentTimeMillis();
      otpCache.entrySet().removeIf(entry -> entry.getValue().expiryTime < now);
  }

  public static class ForgotPasswordRequest {
      public String email;
  }

  public static class ResetPasswordRequest {
      public String email;
      public String otp;
      public String newPassword;
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
      if (!userRepository.existsByEmail(request.email)) {
          return ResponseEntity.badRequest().body(new MessageResponse("Error: No user found with this email."));
      }
      
      cleanUpOtpCache();
      
      // Generate 6-digit OTP
      String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
      // OTP expires in 10 minutes
      otpCache.put(request.email, new OtpData(otp, System.currentTimeMillis() + 10 * 60 * 1000));
      
      // Simulate sending email
      System.out.println("=================================================");
      System.out.println("SIMULATED EMAIL SENT TO: " + request.email);
      System.out.println("YOUR PASSWORD RESET OTP IS: " + otp);
      System.out.println("=================================================");
      
      return ResponseEntity.ok(new MessageResponse("OTP sent to your email successfully! It is valid for 10 minutes."));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
      cleanUpOtpCache();
      
      if (!otpCache.containsKey(request.email)) {
          return ResponseEntity.badRequest().body(new MessageResponse("Error: No valid OTP requested for this email, or it has expired."));
      }
      
      if (!otpCache.get(request.email).otp.equals(request.otp)) {
          return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid OTP."));
      }
      
      // Find user and update password
      User user = userRepository.findByEmail(request.email).orElse(null);
      if (user == null) {
          return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
      }
      
      user.setPassword(encoder.encode(request.newPassword));
      userRepository.save(user);
      
      // Clear OTP
      otpCache.remove(request.email);
      
      return ResponseEntity.ok(new MessageResponse("Password has been reset successfully!"));
  }
}
