package com.pph.shared.validation

object Validators {
    // Indian mobile: 10 digits, starts with 6-9
    private val mobileRegex = Regex("^[6-9]\\d{9}$")

    // Flat format: optional building letter + hyphen + flat number (e.g. A-101, B-202, 101)
    private val flatRegex = Regex("^[A-Za-z]?-?\\d{1,4}[A-Za-z]?$")

    // 6-digit numeric OTP
    private val otpRegex = Regex("^\\d{6}$")

    // HTML tag pattern for sanitization
    private val htmlTagRegex = Regex("<[^>]*>")

    fun isValidMobile(mobile: String): Boolean =
        mobileRegex.matches(mobile.trimStart('+').trimStart('9', '1').let {
            // Accept raw 10-digit or +91 prefixed
            if (mobile.startsWith("+91") && mobile.length == 13) mobile.substring(3)
            else if (mobile.startsWith("91") && mobile.length == 12) mobile.substring(2)
            else mobile
        })

    fun isValidFlat(flat: String): Boolean =
        flat.isNotBlank() && flatRegex.matches(flat.trim())

    fun isValidOtp(otp: String): Boolean =
        otpRegex.matches(otp.trim())

    fun sanitizeText(input: String): String =
        htmlTagRegex.replace(input, "").trim()
}
