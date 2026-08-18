import * as SecureStore from "expo-secure-store";
import type { HttpClient } from "./HttpClient";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

export class HttpError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly body: unknown;
  public readonly method: string;
  public readonly url: string;

  constructor(
    status: number,
    statusText: string,
    body: unknown,
    method: string,
    url: string
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.method = method;
    this.url = url;
  }
}

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch (_e) {
    return null;
  }
}

async function getResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  
  if (!contentType) return null;
  
  if (contentType.includes("application/json")) {
    return parseJsonSafe(response);
  }
  
  if (contentType.includes("text")) {
    return await response.text();
  }
  
  // Para otros tipos, intenta JSON primero, luego texto
  const json = await parseJsonSafe(response);
  if (json !== null) return json;
  
  try {
    return await response.text();
  } catch {
    return null;
  }
}

function logHttpError(
  method: string,
  url: string,
  status: number,
  statusText: string,
  body: unknown,
  hasAuth: boolean
): void {
  // Solo loguear en desarrollo
  const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV === "development";
  
  if (!isDev) return;
  
  console.error(
    "[HTTP ERROR]",
    "\n" +
    `Method: ${method}\n` +
    `URL: ${url}\n` +
    `Status: ${status} ${statusText}\n` +
    `Authentication: ${hasAuth ? "Bearer [REDACTED]" : "none"}\n` +
    `Response Body:\n${JSON.stringify(body, null, 2)}`
  );
}

export class FetchHttpClient implements HttpClient {
  async get<T>(path: string): Promise<T> {
    const token = await SecureStore.getItemAsync("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    
    const fullUrl = `${API_URL}${path}`;
    const response = await fetch(fullUrl, { headers });

    if (!response.ok) {
      const responseBody = await getResponseBody(response);
      logHttpError("GET", fullUrl, response.status, response.statusText, responseBody, !!token);
      
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      throw new HttpError(response.status, response.statusText, responseBody, "GET", fullUrl);
    }

    const responseBody = await getResponseBody(response);
    if (responseBody === null || responseBody === "") {
      return {} as T;
    }
    return responseBody as T;
  }

  async post<T>(path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
    const token = await SecureStore.getItemAsync("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...extraHeaders,
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    
    const fullUrl = `${API_URL}${path}`;
    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const responseBody = await getResponseBody(response);
      logHttpError("POST", fullUrl, response.status, response.statusText, responseBody, !!token);
      
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      throw new HttpError(response.status, response.statusText, responseBody, "POST", fullUrl);
    }

    // Manejar respuestas 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    const responseBody = await getResponseBody(response);
    
    // Si no hay body, retornar null o {}
    if (responseBody === null || responseBody === "") {
      return {} as T;
    }

    return responseBody as T;
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const token = await SecureStore.getItemAsync("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    
    const fullUrl = `${API_URL}${path}`;
    const response = await fetch(fullUrl, {
      method: "PATCH",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const responseBody = await getResponseBody(response);
      logHttpError("PATCH", fullUrl, response.status, response.statusText, responseBody, !!token);
      
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      throw new HttpError(response.status, response.statusText, responseBody, "PATCH", fullUrl);
    }

    if (response.status === 204) {
      return null as T;
    }

    const responseBody = await getResponseBody(response);
    if (responseBody === null || responseBody === "") {
      return {} as T;
    }
    return responseBody as T;
  }

  async delete<T>(path: string): Promise<T> {
    const token = await SecureStore.getItemAsync("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    
    const fullUrl = `${API_URL}${path}`;
    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const responseBody = await getResponseBody(response);
      logHttpError("DELETE", fullUrl, response.status, response.statusText, responseBody, !!token);
      
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      throw new HttpError(response.status, response.statusText, responseBody, "DELETE", fullUrl);
    }

    if (response.status === 204) {
      return null as T;
    }

    const responseBody = await getResponseBody(response);
    if (responseBody === null || responseBody === "") {
      return {} as T;
    }
    return responseBody as T;
  }
}
