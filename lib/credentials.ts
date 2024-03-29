export function getGCPCredentials() {
  // for local development, use gcloud CLI
  if (!process.env.GCP_PRIVATE_KEY) {
    return {};
  }

  // for Vercel, use environment variables
  // GCP Vercel integration: https://www.gcpvercel.com
  return {
    credentials: {
      client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY,
    },
    projectId: process.env.GCP_PROJECT_ID,
  };
}
