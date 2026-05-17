package com.pph.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "jwt")
data class JwtConfig(
    var secret: String = "",
    var expiryHours: Long = 1L
)
