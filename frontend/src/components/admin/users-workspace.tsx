"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getCurrentUser, type AuthUser } from "@/services/auth";
import {
  createUser,
  listUsers,
  resetUserPassword,
  updateUser,
  type AdminUser,
} from "@/services/users";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

export function UsersWorkspace() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [me, setMe] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([listUsers(), getCurrentUser()])
      .then(([usersRes, meRes]) => {
        setUsers(usersRes.data);
        setMe(meRes);
      })
      .catch((e) => setError((e as Error)?.message ?? "Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function openUser(user: AdminUser) {
    setSelected(user);
  }

  async function toggleActive(user: AdminUser) {
    setBusyId(user.id);
    try {
      const { data } = await updateUser(user.id, { is_active: !user.is_active });
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      setSelected((s) => (s && s.id === data.id ? data : s));
    } catch (e) {
      setError((e as Error)?.message ?? "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  const canResetOthers = Boolean(me?.can_reset_passwords);

  return (
    <div className="mx-auto max-w-5xl pt-4 sm:pt-6 lg:pt-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-offwhite">Users</h1>
          <p className="mt-1 text-sm text-muted">
            Everyone with access to this admin panel. Create new users, set permissions, and activate or deactivate accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="shrink-0 rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-teal-dark"
        >
          New user
        </button>
      </header>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-navy/30 px-4 py-12 text-center text-sm text-muted">
          No users yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-navy2 text-[11px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Name / Email</th>
                  <th className="px-4 py-3 font-semibold">Can reset passwords</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => openUser(user)}
                    className="cursor-pointer border-b border-border/60 bg-card transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-offwhite">
                        {user.name}
                        {me?.id === user.id ? <span className="ml-2 text-xs text-muted">(you)</span> : null}
                      </div>
                      <div className="text-xs text-muted">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-muted">{user.can_reset_passwords ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          user.is_active
                            ? "border-teal/40 bg-teal/15 text-teal-light"
                            : "border-border bg-white/5 text-muted"
                        }`}
                      >
                        {user.is_active ? "Active" : "Deactivated"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected ? (
        <UserDetail
          user={selected}
          me={me}
          canResetOthers={canResetOthers}
          busy={busyId === selected.id}
          onClose={() => setSelected(null)}
          onToggleActive={() => toggleActive(selected)}
          onSaved={(updated) => {
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            setSelected(updated);
          }}
        />
      ) : null}

      {creating ? (
        <CreateUserDrawer
          onClose={() => setCreating(false)}
          onCreated={(user) => {
            setUsers((prev) => [...prev, user].sort((a, b) => a.name.localeCompare(b.name)));
            setCreating(false);
          }}
        />
      ) : null}
    </div>
  );
}

function UserDetail({
  user,
  me,
  canResetOthers,
  busy,
  onClose,
  onToggleActive,
  onSaved,
}: {
  user: AdminUser;
  me: AuthUser | null;
  canResetOthers: boolean;
  busy: boolean;
  onClose: () => void;
  onToggleActive: () => void;
  onSaved: (user: AdminUser) => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [canReset, setCanReset] = useState(user.can_reset_passwords);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const isSelf = me?.id === user.id;
  const dirty = name !== user.name || email !== user.email || canReset !== user.can_reset_passwords;

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const { data } = await updateUser(user.id, { name, email, can_reset_passwords: canReset });
      onSaved(data);
    } catch (e) {
      setSaveError((e as Error)?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function submitReset(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setResetMessage("Password must be at least 8 characters.");
      return;
    }
    setResetting(true);
    setResetMessage(null);
    try {
      await resetUserPassword(user.id, password);
      setPassword("");
      setResetMessage("Password updated.");
    } catch (e) {
      setResetMessage((e as Error)?.message ?? "Reset failed.");
    } finally {
      setResetting(false);
    }
  }

  const canReveal = isSelf || canResetOthers;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-navy2 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg font-bold text-offwhite">{user.name}</h2>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-offwhite">
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <form onSubmit={save} className="space-y-3">
            <Field label="Name">
              <TextInput value={name} onChange={setName} />
            </Field>
            <Field label="Email">
              <TextInput value={email} onChange={setEmail} type="email" />
            </Field>
            <label className="flex items-center gap-2 text-xs font-medium text-muted">
              <input type="checkbox" checked={canReset} onChange={(e) => setCanReset(e.target.checked)} />
              Can reset other users&apos; passwords
            </label>
            {saveError ? <p className="text-xs text-red-300">{saveError}</p> : null}
            <button
              type="submit"
              disabled={!dirty || saving}
              className="w-full rounded-lg bg-teal px-3 py-2 text-xs font-semibold text-navy transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>

          <div className="border-t border-border pt-5">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">Status</div>
            <button
              type="button"
              disabled={isSelf || busy}
              onClick={onToggleActive}
              title={isSelf ? "You can't deactivate your own account." : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                user.is_active
                  ? "border-red-500/30 text-red-300 hover:bg-red-500/10"
                  : "border-teal/40 text-teal-light hover:bg-teal/10"
              }`}
            >
              {user.is_active ? "Deactivate account" : "Activate account"}
            </button>
          </div>

          {canReveal ? (
            <form onSubmit={submitReset} className="border-t border-border pt-5">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted">
                {isSelf ? "Change my password" : "Reset password"}
              </div>
              <Field label="New password" hint="At least 8 characters.">
                <TextInput value={password} onChange={setPassword} type="password" placeholder="••••••••" />
              </Field>
              {resetMessage ? (
                <p className={`mt-2 text-xs ${resetMessage === "Password updated." ? "text-teal-light" : "text-red-300"}`}>
                  {resetMessage}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={resetting || password.length === 0}
                className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-xs font-medium text-offwhite transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {resetting ? "Updating…" : "Update password"}
              </button>
            </form>
          ) : (
            <p className="border-t border-border pt-5 text-xs text-muted">
              You don&apos;t have permission to reset this user&apos;s password.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function CreateUserDrawer({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (user: AdminUser) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [canReset, setCanReset] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await createUser({ name, email, password, can_reset_passwords: canReset });
      onCreated(data);
    } catch (e) {
      setError((e as Error)?.message ?? "Could not create the user.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-navy2 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-bold text-offwhite">New user</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-offwhite">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
          <Field label="Name">
            <TextInput value={name} onChange={setName} placeholder="Full name" />
          </Field>
          <Field label="Email">
            <TextInput value={email} onChange={setEmail} type="email" placeholder="name@company.com" />
          </Field>
          <Field label="Password" hint="At least 8 characters.">
            <TextInput value={password} onChange={setPassword} type="password" placeholder="••••••••" />
          </Field>
          <label className="flex items-center gap-2 text-xs font-medium text-muted">
            <input type="checkbox" checked={canReset} onChange={(e) => setCanReset(e.target.checked)} />
            Can reset other users&apos; passwords
          </label>
          {error ? <p className="text-xs text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting || !name || !email || password.length < 8}
            className="w-full rounded-lg bg-teal px-3 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Creating…" : "Create user"}
          </button>
        </form>
      </aside>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-muted">{hint}</span> : null}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-navy px-3.5 py-2.5 text-sm text-offwhite placeholder:text-muted/60 outline-none transition-all focus:border-teal/60 focus:ring-2 focus:ring-teal/15"
    />
  );
}
