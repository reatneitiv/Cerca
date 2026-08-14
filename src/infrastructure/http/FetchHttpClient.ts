import * as SecureStore from "expo-secure-store";
import type { HttpClient } from "./HttpClient";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

export class HttpError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch (_e) {
    return null;
  }
}

export class FetchHttpClient implements HttpClient {
  async get<T>(path: string): Promise<T> {
    const token = await SecureStore.getItemAsync("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await fetch(`${API_URL}${path}`, { headers });

    if (!response.ok) {
      const body = await parseJsonSafe(response);
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      throw new HttpError(response.status, body);
    }

    return response.json() as Promise<T>;
  }

  async post<T>(path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
    const token = await SecureStore.getItemAsync("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...extraHeaders,
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const parsed = await parseJsonSafe(response);
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      throw new HttpError(response.status, parsed);
    }

    return response.json() as Promise<T>;
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const token = await SecureStore.getItemAsync("accessToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const parsed = await parseJsonSafe(response);
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      throw new HttpError(response.status, parsed);
    }

    return response.json() as Promise<T>;
  }

  async delete<T>(path: string): Promise<T> {
    const token = await SecureStore.getItemAsync("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const parsed = await parseJsonSafe(response);
      if (response.status === 401) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      throw new HttpError(response.status, parsed);
    }

    return response.json() as Promise<T>;
  }
}
