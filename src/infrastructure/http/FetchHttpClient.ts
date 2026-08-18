import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from "@/infrastructure/auth/session/AuthSessionStorage";

import type { HttpClient } from "./HttpClient";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
    public readonly method: string,
    public readonly url: string,
  ) {
    super(`HTTP ${status} ${statusText}`);
  }
}

async function getResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  if (contentType.includes("text")) return response.text();
  return null;
}

function isDevelopment(): boolean {
  return typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV === "development";
}

function logHttpError(
  method: string,
  url: string,
  response: Response,
  body: unknown,
  hasAuth: boolean,
): void {
  if (!isDevelopment()) return;

  console.error(
    "[HTTP ERROR]",
    `\nMethod: ${method}\nURL: ${url}\nStatus: ${response.status} ${response.statusText}\n` +
      `Authentication: ${hasAuth ? "Bearer [REDACTED]" : "none"}\n` +
      `Response Body:\n${JSON.stringify(body, null, 2)}`,
  );
}

function isAuthEndpoint(path: string): boolean {
  return path.startsWith("/v1/auth/");
}

function isRefreshResponse(value: unknown): value is { accessToken: string; refreshToken: string } {
  return typeof value === "object" && value !== null &&
    "accessToken" in value && typeof value.accessToken === "string" &&
    "refreshToken" in value && typeof value.refreshToken === "string";
}

export class FetchHttpClient implements HttpClient {
  // The refresh token can rotate, so all client instances must share one refresh operation.
  private static refreshPromise: Promise<boolean> | null = null;

  private async refreshAccessToken(): Promise<boolean> {
    if (FetchHttpClient.refreshPromise) return FetchHttpClient.refreshPromise;

    FetchHttpClient.refreshPromise = (async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) return false;

        if (isDevelopment()) console.log("[AUTH REFRESH] Intentando refrescar access token");

        const response = await fetch(`${API_URL}/v1/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        const body = await getResponseBody(response);

        if (!response.ok || !isRefreshResponse(body)) {
          if (isDevelopment()) console.log("[AUTH REFRESH] No se pudo renovar la sesión", response.status);
          return false;
        }

        await saveSession(body);
        if (isDevelopment()) console.log("[AUTH REFRESH] Tokens refrescados exitosamente");
        return true;
      } catch (error) {
        if (isDevelopment()) console.log("[AUTH REFRESH] Error durante refresh:", error);
        return false;
      } finally {
        FetchHttpClient.refreshPromise = null;
      }
    })();

    return FetchHttpClient.refreshPromise;
  }

  private async request<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>,
    retried = false,
  ): Promise<T> {
    const token = await getAccessToken();
    const headers: Record<string, string> = { ...extraHeaders };

    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    const fullUrl = `${API_URL}${path}`;
    const response = await fetch(fullUrl, {
      method,
      headers: Object.keys(headers).length ? headers : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.ok) {
      if (response.status === 204) return null as T;
      const responseBody = await getResponseBody(response);
      return (responseBody === null || responseBody === "" ? {} : responseBody) as T;
    }

    const responseBody = await getResponseBody(response);
    logHttpError(method, fullUrl, response, responseBody, Boolean(token));

    const canRefresh = response.status === 401 && Boolean(token) && !isAuthEndpoint(path) && !retried;
    if (canRefresh && await this.refreshAccessToken()) {
      return this.request<T>(method, path, body, extraHeaders, true);
    }

    if (response.status === 401 && token && !retried && !isAuthEndpoint(path)) {
      await clearSession();
    }

    throw new HttpError(response.status, response.statusText, responseBody, method, fullUrl);
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>("POST", path, body, extraHeaders);
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}
