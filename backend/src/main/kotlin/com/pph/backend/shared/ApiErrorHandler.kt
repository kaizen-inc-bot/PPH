package com.pph.backend.shared

import com.pph.shared.dto.ApiError
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.AuthenticationException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

// Domain exception types used throughout the backend
class NotFoundException(message: String = "Not found") : RuntimeException(message)
class ConflictException(message: String = "Conflict") : RuntimeException(message)
class BadRequestException(message: String = "Bad request") : RuntimeException(message)
class RateLimitException(message: String = "Too many requests") : RuntimeException(message)

@RestControllerAdvice
class ApiErrorHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ApiError> {
        val details = ex.bindingResult.fieldErrors.associate { it.field to (it.defaultMessage ?: "invalid") }
        return ResponseEntity.badRequest().body(
            ApiError(code = "VALIDATION_ERROR", message = "Validation failed", details = details, status = 400)
        )
    }

    @ExceptionHandler(AccessDeniedException::class)
    fun handleForbidden(ex: AccessDeniedException): ResponseEntity<ApiError> =
        ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ApiError(code = "AUTH_FORBIDDEN", message = ex.message ?: "Forbidden", status = 403)
        )

    @ExceptionHandler(AuthenticationException::class)
    fun handleUnauthorized(ex: AuthenticationException): ResponseEntity<ApiError> =
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            ApiError(code = "AUTH_UNAUTHORIZED", message = ex.message ?: "Unauthorized", status = 401)
        )

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFound(ex: NotFoundException): ResponseEntity<ApiError> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ApiError(code = "NOT_FOUND", message = ex.message ?: "Not found", status = 404)
        )

    @ExceptionHandler(ConflictException::class)
    fun handleConflict(ex: ConflictException): ResponseEntity<ApiError> =
        ResponseEntity.status(HttpStatus.CONFLICT).body(
            ApiError(code = "CONFLICT", message = ex.message ?: "Conflict", status = 409)
        )

    @ExceptionHandler(BadRequestException::class)
    fun handleBadRequest(ex: BadRequestException): ResponseEntity<ApiError> =
        ResponseEntity.badRequest().body(
            ApiError(code = "BAD_REQUEST", message = ex.message ?: "Bad request", status = 400)
        )

    @ExceptionHandler(RateLimitException::class)
    fun handleRateLimit(ex: RateLimitException): ResponseEntity<ApiError> =
        ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
            ApiError(code = "RATE_LIMIT_EXCEEDED", message = ex.message ?: "Too many requests", status = 429)
        )

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(ex: IllegalArgumentException): ResponseEntity<ApiError> =
        ResponseEntity.badRequest().body(
            ApiError(code = "BAD_REQUEST", message = ex.message ?: "Bad request", status = 400)
        )

    @ExceptionHandler(Exception::class)
    fun handleGeneric(ex: Exception, request: HttpServletRequest): ResponseEntity<ApiError> =
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ApiError(code = "INTERNAL_ERROR", message = "An unexpected error occurred", status = 500)
        )
}
