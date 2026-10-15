import { getProductsServicesContent } from "@/data/pages";
import { Reveal } from "@/components/ui/reveal";
import { ProductCatalog } from "@/components/sections/product-catalog";

export async function ProductsShowcaseSection() {
  const content = await getProductsServicesContent();
  const c = content?.productsShowcase;
  if (!c) return null;

  const categories = c.categories ?? [];
  const total = categories.reduce(
    (sum, category) =>
      sum + category.subCategories.reduce((n, sub) => n + sub.products.length, 0),
    0,
  );

  return (
    <section
      id="products"
      className="border-t border-border bg-navy2 px-6 py-20 sm:px-12 lg:px-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            {c.eyebrow}
          </div>
          <h2 className="font-display text-[clamp(30px,3.6vw,44px)] font-extrabold leading-[1.08] text-white">
            {c.headingLine1}
            <br />
            {c.headingLine2}
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[#94A3B8]">
            {total} products across {categories.length} divisions — search or filter by
            category, then open any item for the full specification.
          </p>
        </Reveal>

        <ProductCatalog categories={categories} />
      </div>
    </section>
  );
}
