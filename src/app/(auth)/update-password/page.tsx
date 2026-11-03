"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/sign-in?message=password_updated");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <Card className="w-full max-w-md bg-surface border-dark-border">
        <CardHeader>
          <CardTitle className="text-2xl text-dark-text">Choose a new password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-dark-muted">New password</Label>
              <Input type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-base border-dark-border text-dark-text"
                minLength={6}
                required />
            </div>
            {error && <p className="text-dark-red text-sm">{error}</p>}
            <Button type="submit" disabled={loading}
              className="w-full bg-dark-primary hover:bg-indigo-500">
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
