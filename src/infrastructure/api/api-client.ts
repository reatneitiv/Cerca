export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  // Hace la petición y revisa si salió bien
  private async request<T>(
    path: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, options);

    // Si la respuesta tiene error
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    // Devuelve los datos
    return response.json() as Promise<T>;
  }

  // Petición GET
  async get<T>(
    path: string,
    query?: Record<string, string | number | undefined>
  ): Promise<T> {
    const params = new URLSearchParams();

    // Agrega los parámetros a la URL
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    const url = params.size
      ? `${path}?${params.toString()}`
      : path;

    // Cancela la petición después de 15 segundos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      return await this.request<T>(url, {
        signal: controller.signal,
      });
    } catch (error) {
      // Si se acabó el tiempo
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("API request timed out");
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  // Petición POST
  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // Petición PUT
  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // Petición DELETE
  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, {
      method: "DELETE",
    });
  }
}