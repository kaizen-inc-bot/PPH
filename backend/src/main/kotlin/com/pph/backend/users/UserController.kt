package com.pph.backend.users

import com.pph.backend.shared.toDto
import com.pph.shared.dto.NotificationPreferences
import com.pph.shared.dto.UserDto
import com.pph.shared.dto.VerificationStatus
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

data class RegisterRequestDto(
    val fullName: String,
    val mobileNumber: String,
    val flatNumber: String,
    val password: String? = null
)

@RestController
@RequestMapping("/api/v1/users")
class UserController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@RequestBody request: RegisterRequestDto): UserDto {
        if (userRepository.existsByMobileNumber(request.mobileNumber)) {
            throw com.pph.backend.shared.ConflictException("User already exists with this mobile number")
        }
        val entity = UserEntity(
            fullName = request.fullName,
            mobileNumber = request.mobileNumber,
            flatNumber = request.flatNumber,
            verificationStatus = VerificationStatus.UNVERIFIED,
            passwordHash = request.password?.let { passwordEncoder.encode(it) }
        )
        return userRepository.save(entity).toDto()
    }

    @GetMapping("/me")
    fun me(): UserDto {
        val userId = SecurityContextHolder.getContext().authentication.name
        val entity = userRepository.findById(UUID.fromString(userId))
            .orElseThrow { com.pph.backend.shared.NotFoundException("User not found") }
        return entity.toDto()
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): UserDto {
        val entity = userRepository.findById(id)
            .orElseThrow { com.pph.backend.shared.NotFoundException("User not found") }
        return entity.toDto()
    }
}
