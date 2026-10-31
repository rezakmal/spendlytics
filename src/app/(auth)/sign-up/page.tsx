"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <Card className="w-full max-w-md bg-surface border-dark-border">
        <CardHeader>
          <CardTitle className="text-2xl text-dark-text">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-dark-muted">Email</Label>
              <Input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-base border-dark-border text-dark-text"
                required />
            </div>
            <div>
              <Label className="text-dark-muted">Password</Label>
              <Input type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-base border-dark-border text-dark-text"
                required />
            </div>
            {error && <p className="text-dark-red text-sm">{error}</p>}
            <Button type="submit" disabled={loading}
              className="w-full bg-dark-primary hover:bg-indigo-500">
              {loading ? "Creating account..." : "Sign up"}
            </Button>
            <p className="text-center text-sm text-dark-muted">
              Already have an account?{" "}
              <a href="/sign-in" className="text-dark-indigo underline">
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}