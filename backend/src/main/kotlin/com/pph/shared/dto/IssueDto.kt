package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
enum class IssueStatus {
    OPEN, IN_PROGRESS, RESOLVED, CLOSED
}

@Serializable
enum class IssueCategory {
    PLUMBING, ELECTRICAL, CIVIL, HOUSEKEEPING, SECURITY, OTHER
}

@Serializable
data class IssueDto(
    val id: String,
    val title: String,
    val description: String,
    val category: IssueCategory,
    val status: IssueStatus,
    val reportedByUserId: String,
    val createdAt: String,
    val updatedAt: String,
    val attachmentUrl: String? = null
)

@Serializable
data class IssueCreateDto(
    val title: String,
    val description: String,
    val category: IssueCategory
)
