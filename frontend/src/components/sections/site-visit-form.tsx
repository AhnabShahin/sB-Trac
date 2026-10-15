"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ContactPageForm } from "@/components/sections/contact-page-form";
import { cn } from "@/lib/utils";
import type { SiteVisitFormContent } from "@/data/content-types";
import { submitInquiry } from "@/services/inquiries";

// Distinguishes a site-visit booking from a general inquiry in the admin
// Inquiries list (same table — see services/inquiries.ts / the /contact form).
const SITE_VISIT_SERVICE_LABEL = "Solar Site Visit Request";

const inputClasses =
  "w-full rounded-md border border-border bg-white/[0.04] px-3.5 py-3 text-sm text-white placeholder:text-muted outline-none transition-colors focus:border-amber";

type FormMode = "site-visit" | "inquiry";

const DEFAULT_SITE_TYPE_OPTIONS = ["Rooftop", "Ground-Mounted", "Hybrid / Not Sure"];

function FormTabs({
  mode,
  onChange,
  siteVisitLabel,
  inquiryLabel,
}: {
  mode: FormMode;
  onChange: (mode: FormMode) => void;
  siteVisitLabel: string;
  inquiryLabel: string;
}) {
  const tabs = [
    { key: "site-visit" as const, label: siteVisitLabel },
    { key: "inquiry" as const, label: inquiryLabel },
  ];
  return (
    <div className="mb-6 flex w-fit gap-1 rounded-md bg-white/5 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          data-cursor-interactive
          onClick={() => onChange(tab.key)}
          className={cn(
            "relative rounded px-4 py-1.5 text-[13px] font-medium transition-colors",
            mode === tab.key ? "text-navy" : "text-muted hover:text-white"
          )}
        >
          {mode === tab.key && (
            <motion.span
              layoutId="site-visit-form-tab"
              className="absolute inset-0 rounded bg-amber"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export function SiteVisitForm({ content }: { content?: SiteVisitFormContent }) {
  const [mode, setMode] = useState<FormMode>("site-visit");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const siteVisitLabel = content?.tabSiteVisitLabel || "Book a Free Site Visit";
  const inquiryLabel = content?.tabInquiryLabel || "General Inquiry";
  const heading = content?.heading || "Schedule Your Free Site Visit";
  const submitLabel = content?.submitLabel || "Book Free Site Visit →";
  const successTitle = content?.successTitle || "Site Visit Requested";
  const successBody =
    content?.successBody ||
    "Thank you — our solar engineering team will confirm your site visit slot within 24 hours.";
  const siteTypeOptions = content?.siteTypeOptions?.length ? content.siteTypeOptions : DEFAULT_SITE_TYPE_OPTIONS;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const preferredDate = String(fd.get("preferredDate") ?? "").trim();
    const siteType = String(fd.get("roofType") ?? "").trim();
    const details = String(fd.get("message") ?? "").trim();
    const message = [
      preferredDate ? `Preferred date: ${preferredDate}` : null,
      siteType ? `Site type: ${siteType}` : null,
      details || null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await submitInquiry({
        full_name: String(fd.get("fullName") ?? "").trim(),
        company: String(fd.get("company") ?? "").trim(),
        email: String(fd.get("email") ?? "").trim(),
        phone: String(fd.get("phone") ?? "").trim() || undefined,
        service: SITE_VISIT_SERVICE_LABEL,
        location: String(fd.get("siteAddress") ?? "").trim() || undefined,
        message: message || "Site visit requested.",
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        (err as Error)?.message ?? "Something went wrong. Please try again or call us directly.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (mode === "inquiry") {
    return (
      <ContactPageForm
        header={<FormTabs mode={mode} onChange={setMode} siteVisitLabel={siteVisitLabel} inquiryLabel={inquiryLabel} />}
      />
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[10px] border border-amber/20 bg-card p-8 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber/15 text-amber-dark">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-lg font-bold text-white">{successTitle}</h3>
        <p className="mt-2 max-w-xs text-sm text-muted">{successBody}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[10px] border border-border bg-card p-9">
      <FormTabs mode={mode} onChange={setMode} siteVisitLabel={siteVisitLabel} inquiryLabel={inquiryLabel} />

      <div className="mb-6 font-display text-2xl font-bold text-white">{heading}</div>

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Full Name
          </label>
          <input id="fullName" name="fullName" required className={inputClasses} placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" required className={inputClasses} placeholder="+880 ..." />
        </div>
      </div>

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClasses} placeholder="your@email.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Company
          </label>
          <input id="company" name="company" required className={inputClasses} placeholder="Company name" />
        </div>
      </div>

      <div className="mb-3.5 flex flex-col gap-1.5">
        <label htmlFor="siteAddress" className="text-xs font-semibold uppercase tracking-wide text-muted">
          Site Address
        </label>
        <input
          id="siteAddress"
          name="siteAddress"
          required
          className={inputClasses}
          placeholder="Where should our team visit?"
        />
      </div>

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="preferredDate" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Preferred Date
          </label>
          <input id="preferredDate" name="preferredDate" type="date" required className={inputClasses} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="roofType" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Site Type
          </label>
          <select id="roofType" name="roofType" className={inputClasses} defaultValue="">
            <option value="" disabled className="bg-navy">
              Select site type
            </option>
            {siteTypeOptions.map((option) => (
              <option key={option} value={option} className="bg-navy">
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3.5 flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-muted">
          Additional Details
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${inputClasses} h-[90px] resize-none`}
          placeholder="Tell us about your energy needs or site…"
        />
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        data-cursor-interactive
        className="mt-1.5 w-full rounded-md bg-amber px-6 py-3.5 text-[15px] font-semibold tracking-[0.3px] text-navy transition-all hover:-translate-y-px hover:bg-amber-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
