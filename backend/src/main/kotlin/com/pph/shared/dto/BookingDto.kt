package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
enum class BookingStatus {
    PENDING, CONFIRMED, CANCELLED, COMPLETED
}

@Serializable
data class FacilitySlotDto(
    val id: String,
    val facilityName: String,
    val startTime: String,
    val endTime: String,
    val available: Boolean
)

@Serializable
data class BookingDto(
    val id: String,
    val userId: String,
    val slotId: String,
    val facilityName: String,
    val startTime: String,
    val endTime: String,
    val status: BookingStatus,
    val createdAt: String
)

@Serializable
data class BookingCreateDto(
    val slotId: String
)
