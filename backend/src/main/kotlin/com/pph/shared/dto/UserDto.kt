package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
data class UserDto(
    val id: String,
    val fullName: String,
    val mobileNumber: String,
    val flatNumber: String,
    val verificationStatus: VerificationStatus,
    val roles: List<String>,
    val notificationPreferences: NotificationPreferences,
    val createdAt: String
)

@Serializable
enum class VerificationStatus {
    UNVERIFIED, MOBILE_MATCHED, APPROVED, REJECTED
}

@Serializable
data class NotificationPreferences(
    val smsEnabled: Boolean = true,
    val whatsappEnabled: Boolean = false,
    val consentGiven: Boolean = false,
    val consentTimestamp: String? = null
)

@Serializable
data class RoleDto(
    val id: String,
    val name: String,
    val permissions: Map<String, ModulePermissions>
)

@Serializable
data class ModulePermissions(
    val canView: Boolean = false,
    val canCreate: Boolean = false,
    val canEdit: Boolean = false,
    val canDelete: Boolean = false
)
