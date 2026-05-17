# ── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM gradle:8-jdk21 AS builder

WORKDIR /app

# Copy build definitions first for layer caching
COPY gradle/ gradle/
COPY settings.gradle.kts build.gradle.kts ./

# Download dependencies (cache layer)
RUN gradle dependencies --no-daemon 2>/dev/null || true

# Copy full source
COPY src/ src/

# Build the bootJar
RUN gradle bootJar --no-daemon -x test

# ── Stage 2: Runtime ────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

RUN chown appuser:appgroup app.jar
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
