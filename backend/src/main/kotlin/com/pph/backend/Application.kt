package com.pph.backend

import com.pph.backend.config.JwtConfig
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(JwtConfig::class)
open class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
