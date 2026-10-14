import Link from "next/link";

const QUICK_LINKS = [
  {
    title: "Edit the Home page",
    description: "Hero, strength, portfolio, timeline and the closing CTA — all editable.",
    href: "/pages/home",
    cta: "Open editor",
    live: true,
  },
  {
    title: "All pages",
    description: "Browse every page the panel manages and jump into the ones that are live.",
    href: "/pages",
    cta: "View pages",
    live: true,
  },
];

const STATS = [
  { label: "Editable pages", value: "1", hint: "Home" },
  { label: "Home sections", value: "9", hint: "all dynamic" },
  { label: "Phase", value: "1", hint: "static-backed CMS" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pt-4 sm:pt-6 lg:pt-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-navy2 to-card p-7 sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 50% 70% at 85% 0%, rgba(10,158,136,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-light">
            Phase 1 · Content
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-offwhite sm:text-3xl">
            Welcome back
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Manage the public site&apos;s content here. The Home page is fully dynamic — edit a
            section, save, and it goes live. Menu and Settings modules land in a later phase.
          </p>
          <Link
            href="/pages/home"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-teal-light"
          >
            Edit Home page
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="font-display text-3xl font-extrabold text-offwhite">{stat.value}</div>
            <div className="mt-1 text-sm font-medium text-offwhite/80">{stat.label}</div>
            <div className="mt-0.5 text-xs text-muted">{stat.hint}</div>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted">
          Quick actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-teal/40"
            >
              <div className="flex-1">
                <div className="font-display text-base font-semibold text-offwhite">{link.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{link.description}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-light transition-transform group-hover:translate-x-0.5">
                {link.cta}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
