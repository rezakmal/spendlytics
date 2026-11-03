"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <Card className="w-full max-w-md bg-surface border-dark-border">
        <CardHeader>
          <CardTitle className="text-2xl text-dark-text">Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-dark-muted">
              If an account exists for that email, a password reset link is on
              its way. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-dark-muted">Email</Label>
                <Input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-base border-dark-border text-dark-text"
                  required />
              </div>
              {error && <p className="text-dark-red text-sm">{error}</p>}
              <Button type="submit" disabled={loading}
                className="w-full bg-dark-primary hover:bg-indigo-500">
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
          <p className="text-center text-sm text-dark-muted mt-4">
            Remembered it?{" "}
            <a href="/sign-in" className="text-dark-indigo underline">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
