package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
enum class FeedbackType {
    GENERAL, SUGGESTION, COMPLAINT, COMPLIMENT
}

@Serializable
data class FeedbackDto(
    val id: String,
    val type: FeedbackType,
    val subject: String,
    val message: String,
    val submittedByUserId: String,
    val createdAt: String,
    val isAnonymous: Boolean = false
)

@Serializable
data class FeedbackCreateDto(
    val type: FeedbackType,
    val subject: String,
    val message: String,
    val isAnonymous: Boolean = false
)
