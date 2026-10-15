"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getCurrentUser, type AuthUser } from "@/services/auth";
import { resetUserPassword, updateUser } from "@/services/users";
import { Modal } from "@/components/admin/modal";
import {
  Field,
  GhostButton,
  PrimaryButton,
  Section,
  TextInput,
  initials,
} from "@/components/admin/form-ui";

// Self-service profile: the signed-in user's own name/email and password.
// Editing your own profile and password is always allowed by the backend.
export function ProfileMenu() {
  const [me, setMe] = useState<AuthUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  if (!me) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-navy/40 py-1.5 pl-1.5 pr-2.5 text-left transition-colors hover:border-teal/40"
        title="My profile"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/15 text-[11px] font-bold text-teal-light">
          {initials(me.name)}
        </span>
        <span className="hidden min-w-0 leading-tight sm:block">
          <span className="block max-w-[140px] truncate text-xs font-semibold text-offwhite">{me.name}</span>
          <span className="block text-[10px] uppercase tracking-wide text-muted">
            {me.is_owner ? "Owner" : me.role}
          </span>
        </span>
      </button>

      {open ? <ProfileModal me={me} onClose={() => setOpen(false)} onUpdated={setMe} /> : null}
    </>
  );
}

function ProfileModal({
  me,
  onClose,
  onUpdated,
}: {
  me: AuthUser;
  onClose: () => void;
  onUpdated: (u: AuthUser) => void;
}) {
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileOk, setProfileOk] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Mounted fresh each time the modal opens (parent gates on `open`), so state
  // initializes from the current user without a sync effect.
  const dirty = name !== me.name || email !== me.email;

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileOk(false);
    try {
      const { data } = await updateUser(me.id, { name, email });
      onUpdated({ ...me, name: data.name, email: data.email });
      setProfileOk(true);
    } catch (e) {
      setProfileError((e as Error)?.message ?? "Save failed.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setResetMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setResetMessage("Passwords don't match.");
      return;
    }
    setResetting(true);
    setResetMessage(null);
    try {
      await resetUserPassword(me.id, password);
      setPassword("");
      setConfirm("");
      setResetMessage("Password updated.");
    } catch (e) {
      setResetMessage((e as Error)?.message ?? "Update failed.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="My profile"
      description={me.is_owner ? "Owner account" : me.role}
      size="md"
      icon={<span className="text-sm font-bold">{initials(me.name)}</span>}
    >
      <div className="space-y-6">
        <Section title="Profile">
          <form onSubmit={saveProfile} className="space-y-3">
            <Field label="Name">
              <TextInput value={name} onChange={setName} />
            </Field>
            <Field label="Email">
              <TextInput value={email} onChange={setEmail} type="email" />
            </Field>
            {profileError ? <p className="text-xs text-red-300">{profileError}</p> : null}
            {profileOk ? <p className="text-xs text-teal-light">Profile saved.</p> : null}
            <PrimaryButton type="submit" disabled={!dirty || savingProfile}>
              {savingProfile ? "Saving…" : "Save profile"}
            </PrimaryButton>
          </form>
        </Section>

        <Section title="Change password">
          <form onSubmit={changePassword} className="space-y-3">
            <Field label="New password" hint="At least 8 characters.">
              <TextInput value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            </Field>
            <Field label="Confirm new password">
              <TextInput value={confirm} onChange={setConfirm} type="password" placeholder="••••••••" />
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
      </div>
    </Modal>
  );
}
