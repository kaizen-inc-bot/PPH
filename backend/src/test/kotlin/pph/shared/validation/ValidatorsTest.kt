package com.pph.shared.validation

import kotlin.test.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import kotlin.test.assertEquals

class ValidatorsTest {

    // ── isValidMobile ──────────────────────────────────────────────────────────

    @Test
    fun `isValidMobile accepts 10-digit number starting with 9`() {
        assertTrue(Validators.isValidMobile("9876543210"))
    }

    @Test
    fun `isValidMobile accepts 10-digit number starting with 6`() {
        assertTrue(Validators.isValidMobile("6123456789"))
    }

    @Test
    fun `isValidMobile accepts +91 prefixed number`() {
        assertTrue(Validators.isValidMobile("+919876543210"))
    }

    @Test
    fun `isValidMobile accepts 91 prefixed number`() {
        assertTrue(Validators.isValidMobile("919876543210"))
    }

    @Test
    fun `isValidMobile rejects 9-digit number`() {
        assertFalse(Validators.isValidMobile("987654321"))
    }

    @Test
    fun `isValidMobile rejects number starting with 1`() {
        assertFalse(Validators.isValidMobile("1234567890"))
    }

    @Test
    fun `isValidMobile rejects empty string`() {
        assertFalse(Validators.isValidMobile(""))
    }

    // ── isValidFlat ────────────────────────────────────────────────────────────

    @Test
    fun `isValidFlat accepts numeric flat 101`() {
        assertTrue(Validators.isValidFlat("101"))
    }

    @Test
    fun `isValidFlat accepts flat A-101`() {
        assertTrue(Validators.isValidFlat("A-101"))
    }

    @Test
    fun `isValidFlat rejects empty`() {
        assertFalse(Validators.isValidFlat(""))
    }

    // ── isValidOtp ─────────────────────────────────────────────────────────────

    @Test
    fun `isValidOtp accepts 6-digit otp`() {
        assertTrue(Validators.isValidOtp("123456"))
    }

    @Test
    fun `isValidOtp rejects 5-digit otp`() {
        assertFalse(Validators.isValidOtp("12345"))
    }

    @Test
    fun `isValidOtp rejects letters`() {
        assertFalse(Validators.isValidOtp("12345a"))
    }

    // ── sanitizeText ───────────────────────────────────────────────────────────

    @Test
    fun `sanitizeText strips html tags`() {
        assertEquals("Hello world", Validators.sanitizeText("<b>Hello</b> world"))
    }

    @Test
    fun `sanitizeText leaves plain text unchanged`() {
        assertEquals("plain text", Validators.sanitizeText("plain text"))
    }

    @Test
    fun `sanitizeText trims whitespace`() {
        assertEquals("trimmed", Validators.sanitizeText("  trimmed  "))
    }
}
