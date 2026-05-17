package com.pph.backend.config

import com.pph.backend.users.UserEntity
import com.pph.backend.users.UserRepository
import com.pph.shared.dto.VerificationStatus
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * Seeds a single test user on startup when no users exist.
 * Only active when NOT running with profile "prod".
 *
 * Test credentials:
 *   Mobile : 9999999999
 *   Flat   : A-101
 *   OTP    : any 6 digits (OTP validation is bypassed in dev)
 */
@Component
@Profile("!prod")
class DataInitializer(
    private val userRepository: UserRepository
) : ApplicationRunner {

    private val log = LoggerFactory.getLogger(DataInitializer::class.java)

    override fun run(args: ApplicationArguments) {
        if (userRepository.count() == 0L) {
            val testUser = UserEntity(
                fullName = "Test Resident",
                mobileNumber = "9999999999",
                flatNumber = "A-101",
                verificationStatus = VerificationStatus.APPROVED
            )
            userRepository.save(testUser)
            log.info("===========================================")
            log.info("  TEST USER SEEDED")
            log.info("  Mobile : 9999999999")
            log.info("  Flat   : A-101")
            log.info("  OTP    : any 6 digits (e.g. 123456)")
            log.info("===========================================")
        }
    }
}
