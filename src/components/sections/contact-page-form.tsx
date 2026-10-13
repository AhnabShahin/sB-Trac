"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SERVICE_OPTIONS, BUDGET_OPTIONS } from "@/data/contact";

const inputClasses =
  "w-full rounded-md border border-border bg-white/[0.04] px-3.5 py-3 text-sm text-white placeholder:text-muted outline-none transition-colors focus:border-teal";

export function ContactPageForm({ header }: { header?: ReactNode }) {
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = useReducedMotion();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex min-h-[520px] flex-col items-center justify-center rounded-[10px] border border-teal/20 bg-card p-8 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 font-display text-lg font-bold text-white">Inquiry Received</h3>
        <p className="mt-2 max-w-xs text-sm text-muted">
          Thank you — our engineering team will get back to you within 24
          hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[10px] border border-border bg-card p-9">
      {header}
      <div className="mb-1 font-display text-2xl font-bold text-white">Send an Inquiry</div>
      <p className="mb-6 text-[13px] text-muted">
        Our engineering team reviews every inquiry and responds within 24
        hours.
      </p>

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Full Name *
          </label>
          <input id="fullName" name="fullName" required className={inputClasses} placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Company *
          </label>
          <input id="company" name="company" required className={inputClasses} placeholder="Company name" />
        </div>
      </div>

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Email *
          </label>
          <input id="email" name="email" type="email" required className={inputClasses} placeholder="your@email.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={inputClasses} placeholder="+880 ..." />
        </div>
      </div>

      <div className="mb-3.5 flex flex-col gap-1.5">
        <label htmlFor="service" className="text-xs font-semibold uppercase tracking-wide text-muted">
          Service Required *
        </label>
        <select id="service" name="service" required className={inputClasses} defaultValue="">
          <option value="" disabled className="bg-navy">
            Select a service division
          </option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-navy">
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Project Location
          </label>
          <input id="location" name="location" className={inputClasses} placeholder="City / District" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="budget" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Project Budget (BDT)
          </label>
          <select id="budget" name="budget" className={inputClasses} defaultValue="">
            <option value="" className="bg-navy">
              Select range
            </option>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-navy">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-muted">
          Project Details *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClasses} min-h-[120px] resize-none`}
          placeholder="Describe your project, requirements, timeline, and any specifications you have…"
        />
      </div>

      <div className="mb-5 flex items-start gap-3">
        <input
          type="checkbox"
          id="newsletter"
          name="newsletter"
          className="mt-0.5 h-4 w-4 shrink-0 accent-teal"
        />
        <label htmlFor="newsletter" className="text-[13px] leading-[1.5] text-muted">
          I agree to be contacted by BTEL&apos;s engineering team regarding
          this inquiry and related services.
        </label>
      </div>

      <motion.button
        type="submit"
        data-cursor-interactive
        whileHover={reducedMotion ? undefined : { y: -2 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full rounded-md bg-teal px-6 py-3.5 text-[15px] font-semibold tracking-[0.3px] text-white transition-colors hover:bg-teal-dark"
      >
        Submit Inquiry →
      </motion.button>
      <p className="mt-3 text-center text-[11px] text-muted">
        We typically respond within 24 hours · All inquiries are treated
        confidentially
      </p>
    </form>
  );
}
