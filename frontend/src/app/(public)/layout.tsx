import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
// import { CustomCursor } from "@/components/custom-cursor";
import { SiteHeader } from "@/components/site-header";
import { BackToTopButton } from "@/components/ui/back-to-top-button";
import { getHeaderContent } from "@/data/pages";

// The marketing chrome that used to sit in the root layout. Scoped to the
// public route group so `(auth)` (signup) and `(admin)` (dashboard) render a
// clean shell without the Lenis smooth-scroll wrapper, the site header or the
// back-to-top control.
export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getHeaderContent();

  return (
    <SmoothScrollProvider>
      {/* <CustomCursor /> */}
      <SiteHeader content={content ?? undefined} />
      {children}
      <BackToTopButton />
    </SmoothScrollProvider>
  );
}
