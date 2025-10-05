# Cyber Capture Secure (Server)

Spring Boot backend that saves uploaded photos to `uploads/` and optionally forwards them to Telegram if BOT_TOKEN and CHAT_ID are set as environment variables.

## How to run (Linux/Termux)
1. Copy `.env.example` to `.env` and fill values.
2. Export env vars: `export $(grep -v '^#' .env | xargs)`
3. Run: `mvn spring-boot:run`
