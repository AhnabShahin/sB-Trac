"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ContactPageForm } from "@/components/sections/contact-page-form";
import { cn } from "@/lib/utils";

const inputClasses =
  "w-full rounded-md border border-border bg-white/[0.04] px-3.5 py-3 text-sm text-white placeholder:text-muted outline-none transition-colors focus:border-amber";

type FormMode = "site-visit" | "inquiry";

const TABS = [
  { key: "site-visit", label: "Book a Free Site Visit" },
  { key: "inquiry", label: "General Inquiry" },
] as const;

function FormTabs({
  mode,
  onChange,
}: {
  mode: FormMode;
  onChange: (mode: FormMode) => void;
}) {
  return (
    <div className="mb-6 flex w-fit gap-1 rounded-md bg-white/5 p-1">
      {TABS.map((tab) => (
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

export function SiteVisitForm() {
  const [mode, setMode] = useState<FormMode>("site-visit");
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = useReducedMotion();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (mode === "inquiry") {
    return <ContactPageForm header={<FormTabs mode={mode} onChange={setMode} />} />;
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
        <h3 className="mt-5 font-display text-lg font-bold text-white">Site Visit Requested</h3>
        <p className="mt-2 max-w-xs text-sm text-muted">
          Thank you — our solar engineering team will confirm your site visit
          slot within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[10px] border border-border bg-card p-9">
      <FormTabs mode={mode} onChange={setMode} />

      <div className="mb-6 font-display text-2xl font-bold text-white">
        Schedule Your Free Site Visit
      </div>

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
          <input id="email" name="email" type="email" className={inputClasses} placeholder="your@email.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Company
          </label>
          <input id="company" name="company" className={inputClasses} placeholder="Company name" />
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
            <option value="rooftop" className="bg-navy">Rooftop</option>
            <option value="ground-mounted" className="bg-navy">Ground-Mounted</option>
            <option value="hybrid" className="bg-navy">Hybrid / Not Sure</option>
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

      <button
        type="submit"
        data-cursor-interactive
        className="mt-1.5 w-full rounded-md bg-amber px-6 py-3.5 text-[15px] font-semibold tracking-[0.3px] text-navy transition-all hover:-translate-y-px hover:bg-amber-dark hover:text-white"
      >
        Book Free Site Visit →
      </button>
    </form>
  );
}
