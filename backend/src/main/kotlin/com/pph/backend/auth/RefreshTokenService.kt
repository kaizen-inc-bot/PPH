package com.pph.backend.auth

import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.time.Instant
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

data class RefreshTokenEntry(
    val userId: UUID,
    val expiresAt: Instant
)

@Service
class RefreshTokenService {

    // tokenValue → entry; in-memory store (suitable for single-instance deployment)
    private val store = ConcurrentHashMap<String, RefreshTokenEntry>()
    private val secureRandom = SecureRandom()

    companion object {
        // 7 days in seconds
        const val REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60L
        private const val TOKEN_BYTES = 64
    }

    fun issueRefreshToken(userId: UUID): String {
        val tokenBytes = ByteArray(TOKEN_BYTES)
        secureRandom.nextBytes(tokenBytes)
        val token = tokenBytes.joinToString("") { "%02x".format(it) }
        store[token] = RefreshTokenEntry(
            userId = userId,
            expiresAt = Instant.now().plusSeconds(REFRESH_TOKEN_TTL_SECONDS)
        )
        return token
    }

    /**
     * Validates the given token. If valid, atomically removes it and issues a new token
     * (rotation prevents replay attacks). Returns (userId, newToken) or null if invalid.
     */
    fun validateAndRotate(token: String): Pair<UUID, String>? {
        val entry = store[token] ?: return null
        if (Instant.now().isAfter(entry.expiresAt)) {
            store.remove(token)
            return null
        }
        store.remove(token)
        val newToken = issueRefreshToken(entry.userId)
        return Pair(entry.userId, newToken)
    }

    fun revokeByUserId(userId: UUID) {
        store.entries.removeIf { it.value.userId == userId }
    }

    /** Revoke a single token (used on logout when userId is not in hand). */
    fun revokeToken(token: String) {
        store.remove(token)
    }

    /** Returns the userId stored for a given token without consuming it. */
    fun getUserIdForToken(token: String): UUID? = store[token]?.userId
}

