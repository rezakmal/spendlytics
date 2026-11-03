import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation_error"
  | "conflict"
  | "too_many_requests"
  | "internal_error";

const HTTP_STATUS: Record<ApiErrorCode, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  validation_error: 422,
  conflict: 409,
  too_many_requests: 429,
  internal_error: 500,
};

export function newRequestId(): string {
  return crypto.randomUUID();
}

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

export function fail(
  code: ApiErrorCode,
  message: string,
  requestId: string,
  init?: ResponseInit
): NextResponse {
  return NextResponse.json(
    { error: { code, message, request_id: requestId } },
    { status: HTTP_STATUS[code], ...init }
  );
}
