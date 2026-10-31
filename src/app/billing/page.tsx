import Link from "next/link";

export default function BillingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="text-center">
        <h1 className="text-xl font-medium text-dark-text">Billing</h1>
        <p className="mt-2 text-sm text-dark-muted">
          Stripe subscription management ships in milestone M5.{" "}
          <Link href="/dashboard" className="text-dark-indigo underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
