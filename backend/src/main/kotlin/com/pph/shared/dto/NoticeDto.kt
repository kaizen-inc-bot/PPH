package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
enum class NoticeType {
    GENERAL, MAINTENANCE, EMERGENCY, EVENT
}

@Serializable
data class NoticeDto(
    val id: String,
    val title: String,
    val content: String,
    val type: NoticeType,
    val createdAt: String,
    val createdBy: String,
    val isRead: Boolean = false
)

@Serializable
data class NoticeCreateDto(
    val title: String,
    val content: String,
    val type: NoticeType
)
