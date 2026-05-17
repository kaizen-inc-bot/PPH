// Angular frontend — build is managed by npm.
// Gradle task delegates to npm run build for CI integration (FR-102).
plugins {}

group = "com.pph"
version = "0.0.1-SNAPSHOT"

tasks.register<Exec>("npmInstall") {
    workingDir = projectDir
    commandLine("npm", "install")
    description = "Install Angular frontend dependencies"
}

tasks.register<Exec>("npmBuild") {
    workingDir = projectDir
    commandLine("npm", "run", "build")
    dependsOn("npmInstall")
    description = "Build Angular frontend for production (FR-102)"
}

tasks.register<Exec>("npmTest") {
    workingDir = projectDir
    commandLine("npm", "test", "--", "--watchAll=false")
    dependsOn("npmInstall")
    description = "Run Angular frontend unit tests"
}


