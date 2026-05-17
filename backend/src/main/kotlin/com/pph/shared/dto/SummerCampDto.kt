package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
enum class SummerCampStatus {
    PENDING, PAYMENT_PENDING, CONFIRMED, CANCELLED
}

@Serializable
data class SummerCampParticipantDto(
    val childName: String,
    val age: Int,
    val grade: String
)

@Serializable
data class SummerCampRegistrationDto(
    val id: String,
    val userId: String,
    val participant: SummerCampParticipantDto,
    val status: SummerCampStatus,
    val amount: Long,
    val razorpayOrderId: String? = null,
    val createdAt: String
)

@Serializable
data class SummerCampRegisterDto(
    val participant: SummerCampParticipantDto
)

@Serializable
data class PaymentOrderDto(
    val orderId: String,
    val amount: Long,
    val currency: String = "INR",
    val key: String
)
