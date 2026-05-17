package com.pph.backend.users

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UserRepository : JpaRepository<UserEntity, UUID> {
    fun findByMobileNumber(mobileNumber: String): UserEntity?
    fun existsByMobileNumber(mobileNumber: String): Boolean
}
