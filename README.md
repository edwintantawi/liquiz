# 🌊 LiQuiz - Unleashing the Fluid Power of Learning

**AI-Powered Practice Question Generator** - Turn your study materials, including PDF files, into a dynamic and interactive learning experience with our AI-powered question generator.

## 🚀 Getting Started

### Prerequisites

- [Node JS](https://nodejs.org)
- [Pnpm](https://pnpm.io)
- [Docker](https://www.docker.com)
- [Google Cloud CLI](https://cloud.google.com/cli)
- [Google Cloud Pub/Sub Emulator](https://cloud.google.com/pubsub/docs/emulator)
  - or you can use the [Google Cloud Pub/Sub](https://cloud.google.com/pubsub) directly.
- [Google Cloud Storage](https://cloud.google.com/storage)
- [Google OAuth Credential](https://console.cloud.google.com/apis/credentials)
- [OpenAI API Key](https://openai.com/product)

### Setup the project

1. Clone the repo
2. Create a `.env` file in the root directory and add the following environment variables from the `.env.example` file.
3. Start the Google Cloud Pub/Sub Emulator
   ```bash
   ./scripts/pubsub-emulator.sh
   ```
   ```bash
   ./scripts/pubsub-emulator-topic.sh
   ```
   ```bash
   ./scripts/pubsub-emulator-subscription.sh
   ```
4. Prepare the Google Cloud Storage service

### Running the app

1. Start app and database services
   ```bash
    docker compose up
   ```
2. Open the app in your browser
