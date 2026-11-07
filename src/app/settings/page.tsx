import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex flex-col gap-4 max-w-[1100px] mx-auto">
      <h1 className="text-[18px] font-medium text-dark-text">Settings</h1>
      <SettingsForm initialName={profile?.display_name ?? ""} email={user.email ?? ""} />
    </div>
  );
}
