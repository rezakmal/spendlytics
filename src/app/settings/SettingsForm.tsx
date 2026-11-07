"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsForm({ initialName, email }: { initialName: string; email: string }) {
  const [displayName, setDisplayName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/v1/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: displayName }),
    });

    if (res.ok) {
      toast.success("Profile updated");
      router.refresh();
    } else {
      const body = await res.json().catch(() => null);
      toast.error(body?.error?.message ?? "Failed to update profile");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[560px]">
      <Card className="bg-surface border-dark-border">
        <CardHeader>
          <CardTitle className="text-[16px] text-dark-text">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-dark-muted">Display name</Label>
            <Input value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="bg-base border-dark-border text-dark-text"
              maxLength={80}
              required />
          </div>
          <div>
            <Label className="text-dark-muted">Email</Label>
            <Input value={email} disabled
              className="bg-base border-dark-border text-dark-muted" />
          </div>
          <Button type="submit" disabled={loading}
            className="bg-dark-primary hover:bg-indigo-500">
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-surface border-dark-border">
        <CardHeader>
          <CardTitle className="text-[16px] text-dark-text">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-dark-muted">Currency</Label>
            <span className="text-[13px] text-dark-text bg-base border border-dark-border
              rounded-lg px-3 py-1.5">IDR — Indonesian Rupiah</span>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-dark-muted">Timezone</Label>
            <span className="text-[13px] text-dark-text bg-base border border-dark-border
              rounded-lg px-3 py-1.5">Asia/Jakarta (WIB)</span>
          </div>
          <p className="text-[12px] text-dark-muted">
            Currency and timezone are fixed for all accounts in this MVP.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
