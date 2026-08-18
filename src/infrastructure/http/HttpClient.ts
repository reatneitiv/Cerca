export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}
