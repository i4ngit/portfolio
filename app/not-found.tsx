import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-center px-4">
      <p className="text-7xl font-serif font-bold text-navy/20">404</p>
      <h1 className="mt-4 text-2xl font-bold font-serif text-slate-text">Page not found</h1>
      <p className="mt-2 text-muted text-sm">This page doesn't exist or has been moved.</p>
      <Link href="/" className="mt-6 btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
