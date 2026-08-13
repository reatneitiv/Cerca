// src/infrastructure/http/FetchHttpClient.ts

import type { HttpClient } from "./HttpClient";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

export class FetchHttpClient implements HttpClient {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
