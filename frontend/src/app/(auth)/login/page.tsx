"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  loginUser,
  setAuthCookie,
  type LoginPayload,
} from "@/services/auth";

type Field = keyof LoginPayload;

const INITIAL: LoginPayload = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginPayload>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: Field, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const { token } = await loginUser(form);
      setAuthCookie(token);
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) setErrors(err.fieldErrors);
        setFormError(err.message);
      } else {
        setFormError(
          "Could not reach the server. Make sure the API is running.",
        );
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-light">
            Admin access
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-offwhite">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-muted">
            Access the B-TEL Engineering admin panel.
          </p>
        </div>

        {formError && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber"
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            errors={errors.email}
            disabled={submitting}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(v) => update("password", v)}
            errors={errors.password}
            disabled={submitting}
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-4 py-3 font-semibold text-navy transition-colors hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Spinner />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  type,
  value,
  onChange,
  errors,
  autoComplete,
  disabled,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  autoComplete?: string;
  disabled?: boolean;
}) {
  const invalid = Boolean(errors?.length);
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-offwhite"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-navy/60 px-4 py-2.5 text-offwhite placeholder-muted outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/30 disabled:opacity-60 ${
          invalid ? "border-amber" : "border-border"
        }`}
      />
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-amber">
          {errors![0]}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
