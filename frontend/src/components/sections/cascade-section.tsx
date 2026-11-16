import { getHomeContent } from "@/data/pages";
import { CascadeStackView } from "@/components/sections/cascade-stack-view";

export async function CascadeSection() {
  const content = await getHomeContent();
  if (!content?.cascade) return null;

  return <CascadeStackView content={content.cascade} />;
}
