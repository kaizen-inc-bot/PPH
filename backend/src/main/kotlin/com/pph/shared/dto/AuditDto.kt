package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
data class AuditLogDto(
    val id: String,
    val userId: String,
    val action: String,
    val entityType: String,
    val entityId: String,
    val details: Map<String, String> = emptyMap(),
    val createdAt: String
)
