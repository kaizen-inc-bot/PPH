# ── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM gradle:8-jdk21 AS builder

WORKDIR /workspace

# Copy Gradle wrapper and config first for layer caching
COPY gradle/ gradle/
COPY gradlew gradlew.bat settings.gradle.kts build.gradle.kts ./

# Copy subproject build files
COPY backend/build.gradle.kts backend/build.gradle.kts
COPY frontend/build.gradle.kts frontend/build.gradle.kts

# Download dependencies (cache layer)
RUN ./gradlew :backend:dependencies --no-daemon 2>/dev/null || true

# Copy full source
COPY . .

# Build the bootJar
RUN ./gradlew :backend:bootJar --no-daemon -x test

# ── Stage 2: Runtime ────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

COPY --from=builder /workspace/backend/build/libs/*.jar app.jar

RUN chown appuser:appgroup app.jar
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
