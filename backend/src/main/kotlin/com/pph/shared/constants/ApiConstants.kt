package com.pph.shared.constants

object ApiConstants {
    const val API_VERSION = "v1"
    const val BASE_PATH = "/api/v1"
    const val BASE_URL = "http://localhost:8080"

    // Auth
    const val AUTH_OTP_REQUEST = "$BASE_PATH/auth/otp/request"
    const val AUTH_OTP_VERIFY = "$BASE_PATH/auth/otp/verify"
    const val AUTH_PASSWORD_LOGIN = "$BASE_PATH/auth/password/login"

    // Users
    const val USERS_ME = "$BASE_PATH/users/me"
    const val USERS_REGISTER = "$BASE_PATH/users/register"
    const val USERS_BASE = "$BASE_PATH/users"

    // Notices
    const val NOTICES_BASE = "$BASE_PATH/notices"
    const val NOTICES_SSE = "$BASE_PATH/sse/notices"

    // Bookings
    const val BOOKINGS_SLOTS = "$BASE_PATH/facility-slots"
    const val BOOKINGS_BASE = "$BASE_PATH/bookings"

    // Summer camp
    const val SUMMER_CAMP_BASE = "$BASE_PATH/summer-camp"
    const val SUMMER_CAMP_PAYMENT_ORDER = "$BASE_PATH/summer-camp/payment/order"
    const val SUMMER_CAMP_PAYMENT_WEBHOOK = "$BASE_PATH/summer-camp/payment/webhook"

    // Issues
    const val ISSUES_BASE = "$BASE_PATH/issues"

    // Feedback
    const val FEEDBACK_BASE = "$BASE_PATH/feedback"

    // Digital forms
    const val FORMS_BASE = "$BASE_PATH/digital-forms"

    // Audit
    const val AUDIT_BASE = "$BASE_PATH/audit"

    // Health
    const val HEALTH = "$BASE_PATH/health"

    // Timeouts
    const val REQUEST_TIMEOUT_MS = 30_000L
    const val OTP_EXPIRY_SECONDS = 300L       // 5 minutes
    const val OTP_RATE_LIMIT_SECONDS = 60L    // min gap between OTP requests
}
