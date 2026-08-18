import { HttpError } from "@/infrastructure/http/FetchHttpClient";

function getFieldErrors(errors: unknown): Record<string, string[]> | undefined {
  if (!errors || typeof errors !== "object") return undefined;

  const rawErrors = errors as Record<string, unknown>;
  const fields = rawErrors.fieldErrors && typeof rawErrors.fieldErrors === "object"
    ? rawErrors.fieldErrors as Record<string, unknown>
    : rawErrors;

  const fieldErrors = Object.fromEntries(
    Object.entries(fields).flatMap(([field, messages]) =>
      Array.isArray(messages) && messages.length > 0
        ? [[field, messages.map(String)]]
        : typeof messages === "string"
          ? [[field, [messages]]]
          : messages && typeof messages === "object" && "message" in messages
            ? [[field, [String(messages.message)]]]
            : []
    )
  );

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

function getInvalidParameterErrors(body: Record<string, unknown>): Record<string, string[]> | undefined {
  const parameters = body.invalidParams ?? body.invalid_params ?? body.violations;
  if (!Array.isArray(parameters)) return undefined;

  const fieldErrors = Object.fromEntries(
    parameters.flatMap((parameter) => {
      if (!parameter || typeof parameter !== "object") return [];
      const item = parameter as Record<string, unknown>;
      const field = item.name ?? item.field ?? item.property ?? item.path;
      const message = item.reason ?? item.message ?? item.detail;
      return typeof field === "string" && typeof message === "string"
        ? [[field, [message]]]
        : [];
    })
  );

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function parseApiError(e: unknown): {
  message: string;
  fieldErrors?: Record<string, string[]>;
} {
  if (e instanceof HttpError) {
    const body = e.body as any;
    if (!body) return { message: `Error ${e.status}` };

    if (typeof body === "string") return { message: body };

    if (typeof body === "object") {
      const fieldErrors = getFieldErrors(body.errors);
      if (fieldErrors) {
        const firstMessage = Object.values(fieldErrors)[0][0];
        return { message: firstMessage, fieldErrors };
      }
      const invalidParameterErrors = getInvalidParameterErrors(body);
      if (invalidParameterErrors) {
        const firstMessage = Object.values(invalidParameterErrors)[0][0];
        return { message: firstMessage, fieldErrors: invalidParameterErrors };
      }
      if (body.reason && typeof body.reason === "string")
        return { message: body.reason };
      if (body.message && typeof body.message === "string")
        return { message: body.message };
      if (typeof body.detail === "string") return { message: body.detail };
      if (typeof body.title === "string") return { message: body.title };
      if (Array.isArray(body.message) && body.message.length > 0)
        return { message: String(body.message[0]) };
      if (Array.isArray(body.issues) && body.issues.length > 0) {
        const firstIssue = body.issues[0];
        if (firstIssue && typeof firstIssue === "object" && "message" in firstIssue) {
          return { message: String(firstIssue.message) };
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
