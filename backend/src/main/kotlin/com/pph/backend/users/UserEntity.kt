package com.pph.backend.users

import com.pph.shared.dto.VerificationStatus
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "users")
data class UserEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val fullName: String,

    @Column(nullable = false, unique = true)
    val mobileNumber: String,

    @Column(nullable = false)
    val flatNumber: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val verificationStatus: VerificationStatus = VerificationStatus.UNVERIFIED,

    @Column
    val passwordHash: String? = null,

    @Column(nullable = false)
    val createdAt: Instant = Instant.now()
)
