import Link from "next/link";

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="text-center">
        <h1 className="text-xl font-medium text-dark-text">Transactions</h1>
        <p className="mt-2 text-sm text-dark-muted">
          Transaction history and management ships in milestone M3.{" "}
          <Link href="/dashboard" className="text-dark-indigo underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
