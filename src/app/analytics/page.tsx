import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="text-center">
        <h1 className="text-xl font-medium text-dark-text">Analytics</h1>
        <p className="mt-2 text-sm text-dark-muted">
          Pro 12-month trends ship in milestone M6.{" "}
          <Link href="/dashboard" className="text-dark-indigo underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
