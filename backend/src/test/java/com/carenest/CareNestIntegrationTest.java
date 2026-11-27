package com.carenest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CareNestIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String loginAndGetToken(String email, String password) throws Exception {
        String payload = objectMapper.writeValueAsString(
                Map.of("email", email, "password", password)
        );
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();
        JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
        return node.get("token").asText();
    }

    @Test
    void testPublicEndpointsAndRoleFlows() throws Exception {
        // 1. Public endpoints (9 Pune launch services after ServicePriceUpdater, 4 approved companions)
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(9))
                .andExpect(jsonPath("$[0].effectivePrice").value(499.0));

        mockMvc.perform(get("/api/companions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4));

        // 2. Family login & dashboard
        String familyToken = loginAndGetToken("ananya@carenest.com", "Family@123");
        mockMvc.perform(get("/api/family/dashboard")
                        .header("Authorization", "Bearer " + familyToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eldersCount").value(2));

        // 3. Companion login & dashboard
        String companionToken = loginAndGetToken("meera@carenest.com", "Companion@123");
        mockMvc.perform(get("/api/companion/dashboard")
                        .header("Authorization", "Bearer " + companionToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completedVisitsCount").value(1));

        // 4. Admin login & role protection
        String adminToken = loginAndGetToken("admin@carenest.com", "Admin@123");
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pendingCompanions").value(1));

        // Non-admin cannot access or modify pricing
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + familyToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/admin/services/1")
                        .header("Authorization", "Bearer " + familyToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\",\"regularPrice\":500}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/admin/services/1")
                        .header("Authorization", "Bearer " + companionToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\",\"regularPrice\":500}"))
                .andExpect(status().isForbidden());

        // 5. Dynamic pricing: Admin rejects invalid negative price
        mockMvc.perform(put("/api/admin/services/1")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Companionship (2 hours)\",\"regularPrice\":-100,\"introductoryPrice\":499,\"promotionalPricingEnabled\":true,\"active\":true}"))
                .andExpect(status().isBadRequest());

        // 6. Admin updates service 1 price to 549, new booking uses 549, old booking retains 499
        // (Service 1 = Companionship Visits, was introPrice=499, now set to 549)
        mockMvc.perform(put("/api/admin/services/1")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Companionship Visits\",\"description\":\"Updated desc\",\"iconName\":\"HeartHandshake\",\"durationLabel\":\"2 hours\",\"defaultDurationHours\":2,\"regularPrice\":699,\"introductoryPrice\":549,\"promotionalPricingEnabled\":true,\"active\":true,\"specialOccasion\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.effectivePrice").value(549.0));

        String bookingPayload = objectMapper.writeValueAsString(Map.of(
                "elderProfileId", 1,
                "companionProfileId", 1,
                "serviceCategoryId", 1,
                "bookingDate", LocalDate.now().plusDays(3).toString(),
                "startTime", "11:00",
                "durationHours", 2,
                "specialNotes", "Test dynamic price"
        ));
        mockMvc.perform(post("/api/family/bookings")
                        .header("Authorization", "Bearer " + familyToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookingPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAmount").value(549.0));

        // Verify original booking #1 still retained its original ₹499 price
        mockMvc.perform(get("/api/family/bookings")
                        .header("Authorization", "Bearer " + familyToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == 1)].totalAmount").value(499.0));
    }
}
