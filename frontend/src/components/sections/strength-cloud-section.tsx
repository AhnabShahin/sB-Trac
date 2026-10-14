import { getHomeContent } from "@/data/pages";
import { StrengthCloudView } from "@/components/sections/strength-cloud-view";

export async function StrengthCloudSection() {
  const content = await getHomeContent();
  if (!content?.strength) return null;

  return <StrengthCloudView content={content.strength} />;
}
