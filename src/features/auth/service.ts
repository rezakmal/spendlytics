import type { SupabaseClient, User } from "@supabase/supabase-js";

/** Current authenticated user, or null. */
export async function getSessionUser(supabase: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Current authenticated user, or redirect to sign-in (server components). */
export async function requirePageUser(supabase: SupabaseClient): Promise<User> {
  const user = await getSessionUser(supabase);
  if (!user) throw new AuthRequiredError();
  return user;
}

export class AuthRequiredError extends Error {
  constructor() {
    super("Authentication required");
  }
}
