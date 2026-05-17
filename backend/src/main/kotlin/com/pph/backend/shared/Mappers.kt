package com.pph.backend.shared

import com.pph.backend.users.UserEntity
import com.pph.shared.dto.NotificationPreferences
import com.pph.shared.dto.UserDto

fun UserEntity.toDto(): UserDto = UserDto(
    id = id.toString(),
    fullName = fullName,
    mobileNumber = mobileNumber,
    flatNumber = flatNumber,
    verificationStatus = verificationStatus,
    roles = emptyList(), // roles are loaded separately in future phases
    notificationPreferences = NotificationPreferences(),
    createdAt = createdAt.toString()
)
