import Link from "next/link";
import Image from "next/image";

// Standalone shell for the auth screens: dark navy canvas matching the root
// theme, no marketing header or smooth-scroll. Server-rendered — the page
// inside supplies its own `"use client"` only where form state needs it.
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      {/* Ambient teal/blue glow, GPU-only (opacity + transform), decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(10,158,136,0.18), transparent 70%), radial-gradient(50% 50% at 80% 100%, rgba(32,49,105,0.35), transparent 70%)",
        }}
      />
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-3 text-offwhite transition-opacity hover:opacity-80"
      >
        <Image
          src="/assets/logos/btrac-mark.png"
          alt="B-Trac Engineering Ltd."
          width={40}
          height={40}
          className="h-10 w-auto"
          priority
        />
        <span className="font-display text-lg font-bold tracking-wide">
          B-TEL Engineering
        </span>
      </Link>

      {children}

      <p className="mt-8 text-xs text-muted">
        &copy; {new Date().getFullYear()} B-Trac Engineering Ltd. Admin access.
      </p>
    </div>
  );
}
