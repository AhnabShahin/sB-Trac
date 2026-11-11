import { getClientsContent } from "@/data/pages";
import { TestimonialCarousel } from "@/components/sections/testimonial-carousel";

export async function TestimonialsHomeSection() {
  const content = await getClientsContent();
  const c = content?.clientsTestimonials;
  if (!c || c.items.length === 0) return null;

  return (
    <section className="border-t border-border bg-navy py-24 lg:py-28">
      <TestimonialCarousel
        eyebrow={c.eyebrow}
        headingLine1={c.headingLine1}
        headingHighlight={c.headingHighlight}
        items={c.items}
      />
    </section>
  );
}
