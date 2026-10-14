import { getHomeContent } from "@/data/pages";
import { IsoBandView } from "@/components/sections/iso-band-view";

export async function IsoBandSection() {
  const content = await getHomeContent();
  if (!content?.isoBand) return null;

  return <IsoBandView content={content.isoBand} />;
}
