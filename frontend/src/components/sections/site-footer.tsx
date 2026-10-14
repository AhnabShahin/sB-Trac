import Image from "next/image";
import { CERT_BADGES } from "@/data/contact";
import { FooterHomeLink } from "@/components/sections/footer-home-link";

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center gap-6 border-t border-border bg-navy3 px-6 py-10 sm:flex-row sm:justify-between sm:px-12 lg:px-20">
      {/* The wordmark is the footer's home link, matching the header. It was a
          bare `<span>`, so the logo looked clickable but did nothing. */}
      <FooterHomeLink className="flex items-center rounded-lg border border-white/12 bg-white/[0.06] px-2.5 py-1 shadow-[0_2px_10px_rgba(2,6,17,0.25),inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60">
        <Image
          src="/logo.png"
          alt="B-Trac Engineering"
          // Must match the file's real pixel size. Next uses these to reserve the
          // image's box before it loads; stale values reserve a wrongly-proportioned
          // box and the logo reflows as it decodes.
          width={4712}
          height={435}
          // Unoptimised for the same reason as the header's copy: the wordmark is
          // thin white line art on navy, and a 1920px AVIF served for a ~217px slot
          // blurs the fine strokes badly enough to look like a letter is missing from
          // "ENGINEERING". The source is 52KB, so serving it untouched costs
          // nothing and the browser gets one clean downscale instead of a lossy
          // re-encode followed by a resize.
          unoptimized
          className="h-5 w-auto"
        />
      </FooterHomeLink>

      <div className="text-[13px] text-muted">
        © {new Date().getFullYear()} B-Trac Engineering Ltd. · A Bangla Trac
        Group Company
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {CERT_BADGES.map((badge) => (
          <span
            key={badge}
            className="rounded border border-border bg-white/5 px-3 py-1.5 text-[11px] font-bold tracking-[0.5px] text-muted"
          >
            {badge}
          </span>
        ))}
      </div>
    </footer>
  );
}
