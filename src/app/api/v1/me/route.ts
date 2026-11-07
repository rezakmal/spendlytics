import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { ApiRequestError, assertSameOrigin, requireUser } from "@/lib/api/guard";
import { fail, ok } from "@/lib/api/response";

export const dynamic = "force-dynamic";

const patchMeSchema = z
  .object({
    display_name: z.string().trim().min(1).max(80),
  })
  .strict();

const LOCKED_FIELDS = ["plan", "currency", "timezone", "id", "owner_id"];

function currentJakartaMonth(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find(p => p.type === "year")!.value;
  const month = parts.find(p => p.type === "month")!.value;
  return `${year}-${month}-01`;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { user } = await requireUser(supabase);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, display_name, plan, currency, timezone, created_at")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return fail("not_found", "Profile not found", crypto.randomUUID());
    }

    // usage_monthly is service-role-only (RLS); read via trusted client,
    // always scoped to the requesting user. Counter lands in M3.3 — the
    // row simply won't exist until then, so default to zero.
    const service = createServiceClient();
    const { data: usage } = await service
      .from("usage_monthly")
      .select("tx_count")
      .eq("user_id", user.id)
      .eq("month", currentJakartaMonth())
      .maybeSingle();

    return ok({
      profile,
      quota: {
        month: currentJakartaMonth().slice(0, 7),
        tx_used: usage?.tx_count ?? 0,
        tx_limit: profile.plan === "pro" ? null : 20,
      },
    });
  } catch (err) {
    if (err instanceof ApiRequestError) return err.toResponse();
    return fail("internal_error", "Internal server error", crypto.randomUUID());
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { user, requestId } = await requireUser(supabase);
    assertSameOrigin(request, requestId);

    // Tier, currency, timezone and ownership are server-owned fields —
    // sending them at all is rejected, even with valid values.
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      throw new ApiRequestError(400, "bad_request", "Request body must be valid JSON", requestId);
    }
    if (raw && typeof raw === "object") {
      const forbidden = Object.keys(raw as Record<string, unknown>).filter(k =>
        LOCKED_FIELDS.includes(k)
      );
      if (forbidden.length > 0) {
        throw new ApiRequestError(
          403,
          "forbidden",
          `Fields are read-only: ${forbidden.join(", ")}`,
          requestId
        );
      }
    }

    const parsed = patchMeSchema.safeParse(raw);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new ApiRequestError(422, "validation_error", message, requestId);
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({ display_name: parsed.data.display_name })
      .eq("id", user.id)
      .select("id, display_name, plan, currency, timezone, created_at")
      .single();

    if (error) {
      return fail("internal_error", "Failed to update profile", requestId);
    }

    return ok({ profile });
  } catch (err) {
    if (err instanceof ApiRequestError) return err.toResponse();
    return fail("internal_error", "Internal server error", crypto.randomUUID());
  }
}
