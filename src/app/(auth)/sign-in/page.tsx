"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <Card className="w-full max-w-md bg-surface border-dark-border">
        <CardHeader>
          <CardTitle className="text-2xl text-dark-text">
            Welcome back!
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
            {message === "password_updated" && (
              <p className="text-dark-indigo text-sm">
                Password updated — sign in with your new password.
              </p>
            )}
            <div className="text-right">
              <a href="/forgot-password" className="text-[12px] text-dark-indigo underline">
                Forgot password?
              </a>
            </div>
            <Button type="submit" disabled={loading}
              className="w-full bg-dark-primary hover:bg-indigo-500">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-dark-muted">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="text-dark-indigo underline">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}