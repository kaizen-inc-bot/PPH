package com.pph.backend.auth

import com.pph.backend.shared.toDto
import com.pph.backend.users.UserRepository
import com.pph.shared.dto.auth.AuthResponseDto
import com.pph.shared.dto.auth.OtpRequestDto
import com.pph.shared.dto.auth.OtpVerifyDto
import com.pph.shared.dto.auth.PasswordLoginDto
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

data class RefreshResponse(val accessToken: String, val user: com.pph.shared.dto.UserDto)

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService,
    private val refreshTokenService: RefreshTokenService,
    private val jwtService: JwtService,
    private val userRepository: UserRepository
) {

    @PostMapping("/otp/request")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun requestOtp(@RequestBody request: OtpRequestDto) {
        authService.requestOtp(request)
    }

    @PostMapping("/otp/verify")
    fun verifyOtp(
        @RequestBody request: OtpVerifyDto,
        response: HttpServletResponse
    ): AuthResponseDto {
        val authResponse = authService.verifyOtp(request)
        val userId = UUID.fromString(authResponse.user.id)
        val refreshToken = refreshTokenService.issueRefreshToken(userId)
        setRefreshCookie(response, refreshToken)
        return authResponse
    }

    @PostMapping("/password/login")
    fun passwordLogin(
        @RequestBody request: PasswordLoginDto,
        response: HttpServletResponse
    ): AuthResponseDto {
        val authResponse = authService.passwordLogin(request)
        val userId = UUID.fromString(authResponse.user.id)
        val refreshToken = refreshTokenService.issueRefreshToken(userId)
        setRefreshCookie(response, refreshToken)
        return authResponse
    }

    @PostMapping("/refresh")
    fun refresh(
        @CookieValue(name = "pph_refresh_token", required = false) refreshTokenValue: String?,
        response: HttpServletResponse
    ): ResponseEntity<RefreshResponse> {
        if (refreshTokenValue == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }
        val (userId, newToken) = refreshTokenService.validateAndRotate(refreshTokenValue)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val user = userRepository.findById(userId).orElse(null)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val accessToken = jwtService.generateToken(userId, emptyList()) // roles populated in future phase
        setRefreshCookie(response, newToken)
        return ResponseEntity.ok(RefreshResponse(accessToken = accessToken, user = user.toDto()))
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun logout(
        @CookieValue(name = "pph_refresh_token", required = false) refreshTokenValue: String?,
        response: HttpServletResponse
    ) {
        if (refreshTokenValue != null) {
            val userId = refreshTokenService.getUserIdForToken(refreshTokenValue)
            if (userId != null) {
                refreshTokenService.revokeByUserId(userId)
            } else {
                refreshTokenService.revokeToken(refreshTokenValue)
            }
        }
        clearRefreshCookie(response)
    }

    // ── Cookie helpers ────────────────────────────────────────────────────────

    private fun setRefreshCookie(response: HttpServletResponse, token: String) {
        val cookie = Cookie("pph_refresh_token", token).apply {
            isHttpOnly = true
            secure = true
            path = "/api/v1/auth/refresh"
            maxAge = RefreshTokenService.REFRESH_TOKEN_TTL_SECONDS.toInt()
            setAttribute("SameSite", "Strict")
        }
        response.addCookie(cookie)
    }

    private fun clearRefreshCookie(response: HttpServletResponse) {
        val cookie = Cookie("pph_refresh_token", "").apply {
            isHttpOnly = true
            secure = true
            path = "/api/v1/auth/refresh"
            maxAge = 0
            setAttribute("SameSite", "Strict")
        }
        response.addCookie(cookie)
    }
}

