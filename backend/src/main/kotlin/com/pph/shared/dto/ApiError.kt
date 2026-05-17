package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
data class ApiError(
    val code: String,
    val message: String,
    val details: Map<String, String> = emptyMap(),
    val status: Int = 400
)

sealed class ApiException(message: String) : Exception(message) {
    abstract val code: String
    abstract val status: Int
}

class UnauthorizedException(message: String = "Unauthorized") : ApiException(message) {
    override val code = "AUTH_UNAUTHORIZED"
    override val status = 401
}

class ForbiddenException(message: String = "Forbidden") : ApiException(message) {
    override val code = "AUTH_FORBIDDEN"
    override val status = 403
}

class NotFoundException(message: String = "Not found") : ApiException(message) {
    override val code = "NOT_FOUND"
    override val status = 404
}

class ConflictException(message: String = "Conflict") : ApiException(message) {
    override val code = "CONFLICT"
    override val status = 409
}

class RateLimitException(message: String = "Too many requests") : ApiException(message) {
    override val code = "RATE_LIMIT_EXCEEDED"
    override val status = 429
}

class ServerException(message: String = "Internal server error") : ApiException(message) {
    override val code = "INTERNAL_ERROR"
    override val status = 500
}
