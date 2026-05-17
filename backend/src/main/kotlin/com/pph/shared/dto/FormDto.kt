package com.pph.shared.dto

import kotlinx.serialization.Serializable

@Serializable
enum class FormStatus {
    DRAFT, SUBMITTED, APPROVED, REJECTED
}

@Serializable
data class FormFieldDto(
    val name: String,
    val label: String,
    val type: String,
    val required: Boolean = false,
    val options: List<String> = emptyList()
)

@Serializable
data class FormTemplateDto(
    val id: String,
    val name: String,
    val description: String,
    val fields: List<FormFieldDto>
)

@Serializable
data class FormSubmissionDto(
    val id: String,
    val templateId: String,
    val userId: String,
    val status: FormStatus,
    val submittedAt: String,
    val data: Map<String, String>
)

@Serializable
data class FormSubmitDto(
    val templateId: String,
    val data: Map<String, String>
)
