import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-dark-text">Spendlytics</h1>
        <p className="mt-2 text-sm text-dark-muted">
          Personal finance tracker. Track income and expenses against monthly budgets.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/sign-in"
            className="text-[13px] font-medium bg-dark-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors">
            Sign in
          </Link>
          <Link href="/sign-up"
            className="text-[13px] font-medium border border-dark-border text-dark-muted px-4 py-2 rounded-lg hover:text-dark-text transition-colors">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
