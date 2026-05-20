import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-stone-50 px-4">
      <h1 className="font-display text-2xl font-semibold text-stone-900">Page not found</h1>
      <p className="text-center text-sm text-stone-500">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  );
}
