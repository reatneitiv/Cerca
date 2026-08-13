import { HttpError } from "@/infrastructure/http/FetchHttpClient";

export function parseApiError(e: unknown): {
  message: string;
  fieldErrors?: Record<string, string[]>;
} {
  if (e instanceof HttpError) {
    const body = e.body as any;
    if (!body) return { message: `Error ${e.status}` };

    if (typeof body === "string") return { message: body };

    if (typeof body === "object") {
      if (body.reason && typeof body.reason === "string")
        return { message: body.reason };
      if (body.message && typeof body.message === "string")
        return { message: body.message };
      if (body.errors && typeof body.errors === "object") {
        const firstKey = Object.keys(body.errors)[0];
        const firstVal = body.errors[firstKey];
        if (Array.isArray(firstVal) && firstVal.length > 0) {
          return { message: String(firstVal[0]), fieldErrors: body.errors };
        }
      }
    }

    return { message: `Error ${e.status}` };
  }

  if (e instanceof TypeError)
    return { message: "Error de red. Revisa tu conexión." };

  const msg =
    e && typeof e === "object" && "message" in e
      ? String((e as any).message)
      : String(e);
  return { message: msg || "Ocurrió un error" };
}
