"use client";

import { useEffect, useMemo, useState } from "react";
import { getSettings, saveSettings, type SiteSettings } from "@/services/settings";
import { Field, TextInput } from "@/components/admin/form-ui";

type Group = keyof SiteSettings;

const EMPTY: SiteSettings = {
  identity: { siteName: "", tagline: "", copyright: "" },
  contact: { email: "", phone: "", address: "" },
  social: { facebook: "", linkedin: "", youtube: "", whatsapp: "" },
  seo: { metaTitle: "", metaDescription: "", ogImage: "" },
};

export function SettingsWorkspace() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY);
  const [snapshot, setSnapshot] = useState<string>(JSON.stringify(EMPTY));
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  useEffect(() => {
    getSettings()
      .then(({ settings }) => {
        setSettings(settings);
        setSnapshot(JSON.stringify(settings));
      })
      .catch((e) => setError((e as Error)?.message ?? "Failed to load settings."))
      .finally(() => setLoaded(true));
  }, []);

  const dirty = useMemo(() => JSON.stringify(settings) !== snapshot, [settings, snapshot]);

  function set<G extends Group>(group: G, key: keyof SiteSettings[G], value: string) {
    setSavedOk(false);
    setSettings((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSavedOk(false);
    try {
      const { settings: fresh } = await saveSettings(settings);
      setSettings(fresh);
      setSnapshot(JSON.stringify(fresh));
      setSavedOk(true);
    } catch (e) {
      setError((e as Error)?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl pt-4 sm:pt-6 lg:pt-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-offwhite">Settings</h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
          Site-wide identity, contact details, social links and SEO defaults. These feed the public
          site&apos;s metadata and chrome.
        </p>
      </header>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {!loaded ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </div>
      ) : (
        <div className="space-y-5 pb-24">
          <Card title="Site identity" hint="How the company is named across the site.">
            <Field label="Site name">
              <TextInput value={settings.identity.siteName} onChange={(v) => set("identity", "siteName", v)} placeholder="B-TEL Engineering Ltd" />
            </Field>
            <Field label="Tagline">
              <TextInput value={settings.identity.tagline} onChange={(v) => set("identity", "tagline", v)} placeholder="Powering Bangladesh's Industrial Growth" />
            </Field>
            <Field label="Copyright line" hint="Shown in the footer. Use {year} for the current year.">
              <TextInput value={settings.identity.copyright} onChange={(v) => set("identity", "copyright", v)} placeholder="© {year} B-TEL Engineering Ltd. All rights reserved." />
            </Field>
          </Card>

          <Card title="Contact" hint="Primary company contact details.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <TextInput value={settings.contact.email} onChange={(v) => set("contact", "email", v)} type="email" placeholder="info@btraceng.com" />
              </Field>
              <Field label="Phone">
                <TextInput value={settings.contact.phone} onChange={(v) => set("contact", "phone", v)} placeholder="+880 ..." />
              </Field>
            </div>
            <Field label="Address">
              <Textarea value={settings.contact.address} onChange={(v) => set("contact", "address", v)} placeholder="Street, city, country" />
            </Field>
          </Card>

          <Card title="Social links" hint="Full URLs. Leave blank to hide a channel.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Facebook">
                <TextInput value={settings.social.facebook} onChange={(v) => set("social", "facebook", v)} placeholder="https://facebook.com/..." />
              </Field>
              <Field label="LinkedIn">
                <TextInput value={settings.social.linkedin} onChange={(v) => set("social", "linkedin", v)} placeholder="https://linkedin.com/company/..." />
              </Field>
              <Field label="YouTube">
                <TextInput value={settings.social.youtube} onChange={(v) => set("social", "youtube", v)} placeholder="https://youtube.com/@..." />
              </Field>
              <Field label="WhatsApp">
                <TextInput value={settings.social.whatsapp} onChange={(v) => set("social", "whatsapp", v)} placeholder="https://wa.me/880..." />
              </Field>
            </div>
          </Card>

          <Card title="SEO defaults" hint="Fallback metadata for pages that don't set their own.">
            <Field label="Meta title">
              <TextInput value={settings.seo.metaTitle} onChange={(v) => set("seo", "metaTitle", v)} placeholder="B-TEL Engineering Ltd. | ..." />
            </Field>
            <Field label="Meta description" hint="~150–160 characters is ideal.">
              <Textarea value={settings.seo.metaDescription} onChange={(v) => set("seo", "metaDescription", v)} placeholder="Short summary of the company for search results." />
            </Field>
            <Field label="Open Graph image URL" hint="Social share preview image.">
              <TextInput value={settings.seo.ogImage} onChange={(v) => set("seo", "ogImage", v)} placeholder="https://.../og.jpg" />
            </Field>
          </Card>
        </div>
      )}

      {/* Sticky save bar */}
      {loaded ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4">
          <div className="pointer-events-auto flex items-center gap-4 rounded-full border border-border bg-navy2/95 px-5 py-2.5 shadow-2xl backdrop-blur-md">
            <span className="text-xs text-muted">
              {dirty ? (
                <span className="flex items-center gap-1.5 text-amber">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                  Unsaved changes
                </span>
              ) : savedOk ? (
                <span className="text-teal-light">All changes saved</span>
              ) : (
                "No changes"
              )}
            </span>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save settings"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-base font-semibold text-offwhite">{title}</h2>
        {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full resize-y rounded-lg border border-border bg-navy px-3.5 py-2.5 text-sm text-offwhite outline-none transition-all placeholder:text-muted/60 focus:border-teal/60 focus:ring-2 focus:ring-teal/15"
    />
  );
}
