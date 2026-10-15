"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPages } from "@/services/content";
import { listInquiries } from "@/services/inquiries";
import { listUsers } from "@/services/users";

interface Counts {
  pagesTotal: number;
  pagesEditable: number;
  inquiriesNew: number;
  inquiriesTotal: number;
  users: number;
}

const QUICK_LINKS: { title: string; description: string; href: string; cta: string }[] = [
  {
    title: "Edit the Home page",
    description: "Hero, strength, portfolio, timeline and the closing CTA — all editable.",
    href: "/pages/home",
    cta: "Open editor",
  },
  {
    title: "All pages",
    description: "Every page the panel manages — home, services, projects, partners, clients, contact.",
    href: "/pages",
    cta: "View pages",
  },
  {
    title: "Inquiries",
    description: "Contact-form submissions — triage, read, archive and search.",
    href: "/inquiries",
    cta: "View inbox",
  },
  {
    title: "Users",
    description: "Team access, permissions and password resets.",
    href: "/users",
    cta: "Manage users",
  },
  {
    title: "Settings",
    description: "Site identity, contact details, social links and SEO defaults.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([listPages(), listInquiries({ page: 1 }), listUsers()])
      .then(([pagesR, inqR, usersR]) => {
        const pages = pagesR.status === "fulfilled" ? pagesR.value.pages : [];
        const inq = inqR.status === "fulfilled" ? inqR.value : null;
        const users = usersR.status === "fulfilled" ? usersR.value.data : [];
        setCounts({
          pagesTotal: pages.length,
          pagesEditable: pages.filter((p) => p.editable).length,
          inquiriesNew: inq?.counts.new ?? 0,
          inquiriesTotal: inq?.counts.all ?? 0,
          users: users.length,
        });
      })
      .finally(() => setLoaded(true));
  }, []);

  const stats = [
    { label: "Pages managed", value: counts?.pagesTotal, hint: `${counts?.pagesEditable ?? 0} editable` },
    { label: "New inquiries", value: counts?.inquiriesNew, hint: `${counts?.inquiriesTotal ?? 0} total`, accent: (counts?.inquiriesNew ?? 0) > 0 },
    { label: "Team members", value: counts?.users, hint: "with panel access" },
    { label: "Phase", value: 1, hint: "dynamic CMS", literal: true },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pt-4 sm:pt-6 lg:pt-8">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-navy2 to-card p-7 sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(ellipse 50% 70% at 85% 0%, rgba(10,158,136,0.14) 0%, transparent 70%)" }}
        />
        <div className="relative">
          <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-light">
            B-TEL Admin
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-offwhite sm:text-3xl">Welcome back</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Manage the public site&apos;s content, review contact inquiries, and control team access — all
            from here. Every page is dynamic: edit a section, save, and it goes live.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/pages/home"
              className="inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-teal-light"
            >
              Edit Home page
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/inquiries"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-offwhite transition-colors hover:bg-white/5"
            >
              Review inquiries
              {(counts?.inquiriesNew ?? 0) > 0 ? (
                <span className="rounded-full bg-amber px-1.5 py-0.5 text-[10px] font-bold text-navy">{counts?.inquiriesNew}</span>
              ) : null}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
            <div className={`font-display text-3xl font-extrabold ${stat.accent ? "text-amber" : "text-offwhite"}`}>
              {!loaded && !stat.literal ? <span className="inline-block h-7 w-10 animate-pulse rounded bg-white/10 align-middle" /> : stat.value ?? 0}
            </div>
            <div className="mt-1 text-sm font-medium text-offwhite/80">{stat.label}</div>
            <div className="mt-0.5 text-xs text-muted">{stat.hint}</div>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted">Quick actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
