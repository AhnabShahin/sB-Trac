"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getCurrentUser, type AuthUser } from "@/services/auth";
import { Modal } from "@/components/admin/modal";
import {
  Field,
  GhostButton,
  PrimaryButton,
  ReadRow,
  Section,
  TextInput,
  Toggle,
  initials,
} from "@/components/admin/form-ui";
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

// Permission model — mirror of backend App\Http\Controllers\Admin\UserController.
function canEditProfileOf(me: AuthUser | null, u: AdminUser): boolean {
  if (!me) return false;
  if (me.id === u.id) return true;
  if (u.is_owner) return false;
  return Boolean(me.is_owner) || Boolean(me.can_edit_profiles);
}
function canManage(me: AuthUser | null, u: AdminUser): boolean {
  if (!me) return false;
  if (u.is_owner) return Boolean(me.is_owner) && me.id === u.id;
  return Boolean(me.is_owner);
}
function canResetPasswordOf(me: AuthUser | null, u: AdminUser): boolean {
  if (!me) return false;
  if (u.is_owner) return me.id === u.id;
  if (me.id === u.id) return true;
  return Boolean(me.is_owner) || Boolean(me.can_reset_passwords);
}

export function UsersWorkspace() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [me, setMe] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);

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

  const meIsOwner = Boolean(me?.is_owner);

  function onSaved(updated: AdminUser) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setSelected((s) => (s && s.id === updated.id ? updated : s));
  }

  return (
    <div className="mx-auto max-w-5xl pt-4 sm:pt-6 lg:pt-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-offwhite">Users</h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            Everyone with access to this admin panel. {meIsOwner
              ? "As the owner you can create users, grant permissions, and reset passwords."
              : "You can edit your own profile" + (me?.can_edit_profiles ? " and other users' profiles" : "") + (me?.can_reset_passwords ? ", and reset passwords." : ".")}
          </p>
        </div>
        {meIsOwner ? (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-teal-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New user
          </button>
        ) : null}
      </header>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-navy/30 px-4 py-12 text-center text-sm text-muted">
          No users yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-navy2 text-[11px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Permissions</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelected(user)}
                    className="cursor-pointer border-b border-border/60 bg-card transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/15 text-xs font-bold text-teal-light">
                          {initials(user.name)}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-medium text-offwhite">
                            <span className="truncate">{user.name}</span>
                            {me?.id === user.id ? <span className="text-xs font-normal text-muted">(you)</span> : null}
                            {user.is_owner ? <OwnerPill /> : null}
                          </div>
                          <div className="truncate text-xs text-muted">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PermissionChips user={user} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge active={user.is_active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <UserDetailModal
        user={selected}
        me={me}
        onClose={() => setSelected(null)}
        onSaved={onSaved}
      />

      {creating ? (
        <CreateUserModal
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

function OwnerPill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber/40 bg-amber/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5">
        <path d="m12 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L3.2 7.7l5.4-.8z" />
      </svg>
      Owner
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        active ? "border-teal/40 bg-teal/15 text-teal-light" : "border-border bg-white/5 text-muted"
      }`}
    >
      {active ? "Active" : "Deactivated"}
    </span>
  );
}

function PermissionChips({ user }: { user: AdminUser }) {
  if (user.is_owner) {
    return <span className="text-xs text-muted">All permissions</span>;
  }
  const chips: string[] = [];
  if (user.can_edit_profiles) chips.push("Edit profiles");
  if (user.can_reset_passwords) chips.push("Reset passwords");
  if (chips.length === 0) return <span className="text-xs text-muted/70">Own profile only</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <span key={c} className="rounded-md border border-border bg-navy/60 px-2 py-0.5 text-[11px] font-medium text-offwhite/80">
          {c}
        </span>
      ))}
    </div>
  );
}

function UserDetailModal({
  user,
  me,
  onClose,
  onSaved,
}: {
  user: AdminUser | null;
  me: AuthUser | null;
  onClose: () => void;
  onSaved: (user: AdminUser) => void;
}) {
  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title={user?.name ?? ""}
      description={user?.email}
      size="md"
      icon={
        <span className="text-sm font-bold">{user ? initials(user.name) : ""}</span>
      }
    >
      {user ? <UserDetailBody key={user.id} user={user} me={me} onSaved={onSaved} /> : null}
    </Modal>
  );
}

function UserDetailBody({
  user,
  me,
  onSaved,
}: {
  user: AdminUser;
  me: AuthUser | null;
  onSaved: (user: AdminUser) => void;
}) {
  const isSelf = me?.id === user.id;
  const editProfile = canEditProfileOf(me, user);
  const manage = canManage(me, user);
  const resetPw = canResetPasswordOf(me, user);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileOk, setProfileOk] = useState(false);

  const [canReset, setCanReset] = useState(user.can_reset_passwords);
  const [canEdit, setCanEdit] = useState(user.can_edit_profiles);
  const [savingPerms, setSavingPerms] = useState(false);
  const [permsError, setPermsError] = useState<string | null>(null);
  const [permsOk, setPermsOk] = useState(false);

  const [togglingActive, setTogglingActive] = useState(false);

  const [password, setPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // State initializes from props; the parent keys this component by user id, so
  // opening a different user remounts it with fresh state (no sync effect).
  const profileDirty = name !== user.name || email !== user.email;
  const permsDirty = canReset !== user.can_reset_passwords || canEdit !== user.can_edit_profiles;

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileOk(false);
    try {
      const { data } = await updateUser(user.id, { name, email });
      onSaved(data);
      setProfileOk(true);
    } catch (e) {
      setProfileError((e as Error)?.message ?? "Save failed.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePerms(e: FormEvent) {
    e.preventDefault();
    setSavingPerms(true);
    setPermsError(null);
    setPermsOk(false);
    try {
      const { data } = await updateUser(user.id, {
        can_reset_passwords: canReset,
        can_edit_profiles: canEdit,
      });
      onSaved(data);
      setPermsOk(true);
    } catch (e) {
      setPermsError((e as Error)?.message ?? "Save failed.");
    } finally {
      setSavingPerms(false);
    }
  }

  async function toggleActive() {
    setTogglingActive(true);
    setPermsError(null);
    try {
      const { data } = await updateUser(user.id, { is_active: !user.is_active });
      onSaved(data);
    } catch (e) {
      setPermsError((e as Error)?.message ?? "Update failed.");
    } finally {
      setTogglingActive(false);
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

  const ownerLocked = user.is_owner && !isSelf;

  return (
    <div className="space-y-6">
      {ownerLocked ? (
        <p className="flex items-start gap-2 rounded-lg border border-amber/30 bg-amber/10 px-3 py-2.5 text-xs leading-relaxed text-amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="mt-0.5 h-4 w-4 shrink-0">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          This is the owner account. Only the owner can change its profile, permissions and password.
        </p>
      ) : null}

      {/* Profile */}
      <Section title="Profile">
        {editProfile ? (
          <form onSubmit={saveProfile} className="space-y-3">
            <Field label="Name">
              <TextInput value={name} onChange={setName} />
            </Field>
            <Field label="Email">
              <TextInput value={email} onChange={setEmail} type="email" />
            </Field>
            {profileError ? <p className="text-xs text-red-300">{profileError}</p> : null}
            {profileOk ? <p className="text-xs text-teal-light">Profile saved.</p> : null}
            <PrimaryButton type="submit" disabled={!profileDirty || savingProfile}>
              {savingProfile ? "Saving…" : "Save profile"}
            </PrimaryButton>
          </form>
        ) : (
          <dl className="space-y-2 text-sm">
            <ReadRow label="Name" value={user.name} />
            <ReadRow label="Email" value={user.email} />
            <p className="pt-1 text-xs text-muted">You don&apos;t have permission to edit this profile.</p>
          </dl>
        )}
      </Section>

      {/* Permissions */}
      <Section title="Permissions & role">
        {user.is_owner ? (
          <p className="text-xs leading-relaxed text-muted">
            The owner holds every permission by default and cannot have them revoked.
          </p>
        ) : manage ? (
          <form onSubmit={savePerms} className="space-y-3">
            <Toggle
              checked={canEdit}
              onChange={setCanEdit}
              label="Can edit other users' profiles"
              hint="Edit any non-owner user's name and email."
            />
            <Toggle
              checked={canReset}
              onChange={setCanReset}
              label="Can reset other users' passwords"
              hint="Set a new password for any non-owner user."
            />
            {permsError ? <p className="text-xs text-red-300">{permsError}</p> : null}
            {permsOk ? <p className="text-xs text-teal-light">Permissions saved.</p> : null}
            <PrimaryButton type="submit" disabled={!permsDirty || savingPerms}>
              {savingPerms ? "Saving…" : "Save permissions"}
            </PrimaryButton>
          </form>
        ) : (
          <div className="space-y-2">
            <PermissionChips user={user} />
            <p className="text-xs text-muted">Only the owner can change permissions.</p>
          </div>
        )}
      </Section>

      {/* Status — owner-managed, never for the owner row or yourself */}
      {manage && !user.is_owner && !isSelf ? (
        <Section title="Account status">
          <button
            type="button"
            disabled={togglingActive}
            onClick={toggleActive}
            className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              user.is_active
                ? "border-red-500/30 text-red-300 hover:bg-red-500/10"
                : "border-teal/40 text-teal-light hover:bg-teal/10"
            }`}
          >
            {togglingActive ? "Updating…" : user.is_active ? "Deactivate account" : "Activate account"}
          </button>
        </Section>
      ) : null}

      {/* Password */}
      {resetPw ? (
        <Section title={isSelf ? "Change my password" : "Reset password"}>
          <form onSubmit={submitReset} className="space-y-2">
            <Field label="New password" hint="At least 8 characters.">
              <TextInput value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            </Field>
            {resetMessage ? (
              <p className={`text-xs ${resetMessage === "Password updated." ? "text-teal-light" : "text-red-300"}`}>
                {resetMessage}
              </p>
            ) : null}
            <GhostButton type="submit" disabled={resetting || password.length === 0}>
              {resetting ? "Updating…" : "Update password"}
            </GhostButton>
          </form>
        </Section>
      ) : null}
    </div>
  );
}

function CreateUserModal({
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
  const [canEdit, setCanEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await createUser({
        name,
        email,
        password,
        can_reset_passwords: canReset,
        can_edit_profiles: canEdit,
      });
      onCreated(data);
    } catch (e) {
      setError((e as Error)?.message ?? "Could not create the user.");
    } finally {
      setSubmitting(false);
    }
  }

  const valid = Boolean(name) && Boolean(email) && password.length >= 8;

  return (
    <Modal
      open
      onClose={onClose}
      title="New user"
      description="Create an admin account and set its permissions."
      size="md"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5">
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6M19 8v6M22 11h-6" />
        </svg>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name">
          <TextInput value={name} onChange={setName} placeholder="Full name" />
        </Field>
        <Field label="Email">
          <TextInput value={email} onChange={setEmail} type="email" placeholder="name@company.com" />
        </Field>
        <Field label="Password" hint="At least 8 characters.">
          <TextInput value={password} onChange={setPassword} type="password" placeholder="••••••••" />
        </Field>
        <div className="space-y-3 rounded-lg border border-border bg-navy/40 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Permissions</p>
          <Toggle checked={canEdit} onChange={setCanEdit} label="Can edit other users' profiles" />
          <Toggle checked={canReset} onChange={setCanReset} label="Can reset other users' passwords" />
        </div>
        {error ? <p className="text-xs text-red-300">{error}</p> : null}
        <PrimaryButton type="submit" disabled={submitting || !valid}>
          {submitting ? "Creating…" : "Create user"}
        </PrimaryButton>
      </form>
    </Modal>
  );
}

