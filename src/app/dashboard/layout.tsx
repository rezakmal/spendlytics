import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="flex flex-col h-screen bg-base overflow-hidden">
      <Navbar email={user.email ?? ""} plan={profile?.plan ?? "free"} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar plan={profile?.plan ?? "free"} />
        <main className="flex-1 overflow-auto p-5">{children}</main>
      </div>
    </div>
  );
}