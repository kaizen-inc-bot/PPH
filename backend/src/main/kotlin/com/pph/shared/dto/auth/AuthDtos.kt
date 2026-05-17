package com.pph.shared.dto.auth

import com.pph.shared.dto.UserDto
import kotlinx.serialization.Serializable

@Serializable
data class OtpRequestDto(
    val mobileNumber: String
)

@Serializable
data class OtpVerifyDto(
    val mobileNumber: String,
    val otp: String
)

@Serializable
data class PasswordLoginDto(
    val mobileNumber: String,
    val password: String
)

@Serializable
data class AuthResponseDto(
    val token: String,
    val user: UserDto
)
