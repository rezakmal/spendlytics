import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { ZodSchema } from "zod";
import { fail, newRequestId } from "./response";

export class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public requestId: string = newRequestId()
  ) {
    super(message);
  }

  toResponse() {
    return fail(
      this.statusCode === 401
        ? "unauthorized"
        : this.statusCode === 403
          ? "forbidden"
          : this.statusCode === 404
            ? "not_found"
            : this.statusCode === 422
              ? "validation_error"
              : this.statusCode === 409
                ? "conflict"
                : this.statusCode === 429
                  ? "too_many_requests"
                  : this.statusCode === 400
                    ? "bad_request"
                    : "internal_error",
      this.message,
      this.requestId
    );
  }
}

/** Resolve the authenticated user or throw a 401 envelope error. */
export async function requireUser(
  supabase: SupabaseClient
): Promise<{ user: User; requestId: string }> {
  const requestId = newRequestId();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new ApiRequestError(401, "unauthorized", "Authentication required", requestId);
  }
  return { user, requestId };
}

/** Parse a JSON body against a Zod schema or throw a 422 envelope error. */
export async function parseBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
  requestId: string
): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new ApiRequestError(400, "bad_request", "Request body must be valid JSON", requestId);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new ApiRequestError(422, "validation_error", message, requestId);
  }
  return parsed.data;
}

/**
 * CSRF guard for cookie-authenticated mutations: the Origin header (falling
 * back to Referer, then Host) must match the request's own host.
 */
export function assertSameOrigin(request: NextRequest, requestId: string): void {
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  if (!origin) return; // non-browser clients (curl, service-to-service) have no origin

  const host = request.headers.get("host");
  if (!host) return;

  try {
    if (new URL(origin).host !== host) {
      throw new ApiRequestError(403, "forbidden", "Origin mismatch", requestId);
    }
  } catch (err) {
    if (err instanceof ApiRequestError) throw err;
    throw new ApiRequestError(403, "forbidden", "Invalid origin header", requestId);
  }
}
