import { PagesWorkspace } from "@/components/admin/pages-workspace";

// Deep link into the workspace with a page preselected. The workspace itself
// gates which slugs are editable; a non-editable slug simply shows the list.
export default async function PageEditorRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PagesWorkspace initialSlug={slug} />;
}
