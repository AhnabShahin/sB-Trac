import { getProductCategories } from "@/data/products";
import { Reveal } from "@/components/ui/reveal";
import { ProductCatalog } from "@/components/sections/product-catalog";

/**
 * Product showcase placed below the service list. The catalogue inside is
 * filterable by main category, so visitors can narrow the range without leaving
 * the page.
 */
export async function ProductsShowcaseSection() {
  const categories = await getProductCategories();
  const total = categories.reduce(
    (sum, category) =>
      sum + category.subCategories.reduce((n, sub) => n + sub.products.length, 0),
    0
  );

  return (
    // `id="products"` is the anchor the header's "Products & Services" nav item
    // targets, so that link lands the reader on the catalogue rather than at the
    // top of the page. `SmoothScrollProvider` resolves it through Lenis.
    <section
      id="products"
      className="border-t border-border bg-navy2 px-6 py-20 sm:px-12 lg:px-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-teal">
            Product Catalogue
          </div>
          <h2 className="font-display text-[clamp(30px,3.6vw,44px)] font-extrabold leading-[1.08] text-white">
            Browse Our Full
            <br />
            Product Range
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
