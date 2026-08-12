const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

if (!configuredUrl) {
  throw new Error("EXPO_PUBLIC_API_URL no está configurada.");
}

export const API_BASE_URL = `${configuredUrl.replace(/\/$/, "").replace(/\/v1$/, "")}/v1`;
