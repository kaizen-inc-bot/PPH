package com.pph.backend.auth

import com.pph.backend.config.JwtConfig
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.Date
import java.util.UUID

@Service
class JwtService(private val jwtConfig: JwtConfig) {

    private val signingKey by lazy {
        val keyBytes = jwtConfig.secret.toByteArray(StandardCharsets.UTF_8)
        Keys.hmacShaKeyFor(keyBytes)
    }

    fun generateToken(userId: UUID, roles: List<String>): String {
        val now = Instant.now()
        val expiry = now.plusSeconds(jwtConfig.expiryHours * 3600)
        return Jwts.builder()
            .subject(userId.toString())
            .claim("roles", roles)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiry))
            .signWith(signingKey)
            .compact()
    }

    fun validateToken(token: String): Boolean = runCatching { parseClaims(token) }.isSuccess

    fun extractUserId(token: String): UUID =
        UUID.fromString(parseClaims(token).subject)

    @Suppress("UNCHECKED_CAST")
    fun extractRoles(token: String): List<String> =
        parseClaims(token).get("roles", List::class.java) as List<String>

    private fun parseClaims(token: String): Claims =
        Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload
}
