export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-light">
          Phase 1
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold text-offwhite">
          Welcome to the Admin Dashboard
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          This panel is intentionally empty for now. Content, menu and settings
          modules will land here as the public site is made dynamic.
        </p>
      </div>
    </div>
  );
}
