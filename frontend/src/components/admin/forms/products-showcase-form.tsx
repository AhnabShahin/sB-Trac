"use client";

import { useState } from "react";
import {
  AddButton,
  Field,
  MediaField,
  RemoveButton,
  SectionCard,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ProductsShowcaseContent } from "@/data/content-types";
import type {
  Product,
  ProductAccent,
  ProductCategory,
  ProductSubCategory,
} from "@/data/products";

export const EMPTY_PRODUCTS_SHOWCASE: ProductsShowcaseContent = {
  eyebrow: "",
  headingLine1: "",
  headingLine2: "",
  categories: [],
};

const ACCENTS = [
  { value: "blue", label: "Blue" },
  { value: "amber", label: "Amber" },
  { value: "teal", label: "Teal" },
  { value: "purple", label: "Purple" },
  { value: "cyan", label: "Cyan" },
];

// Ids anchor the catalogue's deep links and React keys, so new rows get a stable
// unique one rather than an empty string that would collide.
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
const emptyProduct = (): Product => ({ id: uid("prod"), title: "", writeUp: "", image: "", highlights: [], gallery: [] });
const emptySub = (): ProductSubCategory => ({ id: uid("sub"), name: "", products: [] });
const emptyCategory = (): ProductCategory => ({ id: uid("cat"), name: "", shortName: "", description: "", accent: "teal", image: "", subCategories: [] });

const countProducts = (c: ProductCategory) => c.subCategories.reduce((n, s) => n + s.products.length, 0);
const previewSrc = (v: string) => (!v ? "" : /^https?:\/\//i.test(v) || v.startsWith("/") ? v : `/${v}`);

// Which screen of the drill-down is showing. Kept in the form so leaving and
// re-opening the Product Catalogue tab starts back at the category list.
type View =
  | { level: "root" }
  | { level: "category"; ci: number }
  | { level: "subcategory"; ci: number; si: number }
  | { level: "product"; ci: number; si: number; pi: number };

export function ProductsShowcaseForm({
  value,
  onChange,
  slug,
}: {
  value: ProductsShowcaseContent | undefined;
  onChange: (next: ProductsShowcaseContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PRODUCTS_SHOWCASE;
  const [view, setView] = useState<View>({ level: "root" });

  const set = (patch: Partial<ProductsShowcaseContent>) => onChange({ ...v, ...patch });
  const cats = v.categories;
  const setCats = (next: ProductCategory[]) => set({ categories: next });
  const updCat = (ci: number, patch: Partial<ProductCategory>) => setCats(cats.map((c, i) => (i === ci ? { ...c, ...patch } : c)));
  const updSub = (ci: number, si: number, patch: Partial<ProductSubCategory>) =>
    updCat(ci, { subCategories: cats[ci].subCategories.map((s, i) => (i === si ? { ...s, ...patch } : s)) });
  const updProd = (ci: number, si: number, pi: number, patch: Partial<Product>) =>
    updSub(ci, si, { products: cats[ci].subCategories[si].products.map((p, i) => (i === pi ? { ...p, ...patch } : p)) });

  // Guard against a view pointing at something that was removed elsewhere.
  const cat = "ci" in view ? cats[view.ci] : undefined;
  const sub = cat && "si" in view ? cat.subCategories[view.si] : undefined;
  const prod = sub && "pi" in view ? sub.products[view.pi] : undefined;
  if (("ci" in view && !cat) || ("si" in view && !sub) || ("pi" in view && !prod)) {
    setView({ level: "root" });
    return null;
  }

  const crumbs: { label: string; onClick: () => void }[] = [
    { label: "Categories", onClick: () => setView({ level: "root" }) },
  ];
  if (cat && "ci" in view) crumbs.push({ label: cat.shortName || cat.name || "Category", onClick: () => setView({ level: "category", ci: view.ci }) });
  if (sub && "si" in view) crumbs.push({ label: sub.name || "Sub-category", onClick: () => setView({ level: "subcategory", ci: view.ci, si: view.si }) });
  if (prod) crumbs.push({ label: prod.title || "Product", onClick: () => {} });

  return (
    <div className="space-y-5">
      {view.level === "root" ? (
        <SectionCard title="Section heading">
          <div className="space-y-4">
            <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Product Catalogue" /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Browse Our Full" /></Field>
              <Field label="Heading line 2"><TextInput value={v.headingLine2} onChange={(x) => set({ headingLine2: x })} placeholder="Product Range" /></Field>
            </div>
          </div>
        </SectionCard>
      ) : (
        <Breadcrumb crumbs={crumbs} />
      )}

      {/* ---- Level: categories list ---- */}
      {view.level === "root" ? (
        <SectionCard
          title="Catalogue categories"
          description="Open a category to manage its sub-groups and products."
          action={<AddButton label="Add category" onClick={() => { setCats([...cats, emptyCategory()]); setView({ level: "category", ci: cats.length }); }} />}
        >
          <RowList
            items={cats}
            emptyText="No categories yet — add one, or load the demo."
            rowKey={(c) => c.id}
            badge={(c) => c.shortName}
            title={(c) => c.name || "Untitled category"}
            sub={(c) => `${c.subCategories.length} groups · ${countProducts(c)} products`}
            onOpen={(i) => setView({ level: "category", ci: i })}
            onRemove={(i) => setCats(cats.filter((_, idx) => idx !== i))}
          />
        </SectionCard>
      ) : null}

      {/* ---- Level: one category ---- */}
      {view.level === "category" && cat ? (
        <>
          <SectionCard title="Category details">
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_8rem_8rem]">
                <Field label="Name"><TextInput value={cat.name} onChange={(x) => updCat(view.ci, { name: x })} placeholder="Switchgear & Control Panels" /></Field>
                <Field label="Short name"><TextInput value={cat.shortName} onChange={(x) => updCat(view.ci, { shortName: x })} placeholder="SCP" /></Field>
                <Field label="Accent"><Select value={cat.accent} onChange={(x) => updCat(view.ci, { accent: x as ProductAccent })} options={ACCENTS} /></Field>
              </div>
              <Field label="Description"><TextArea value={cat.description} onChange={(x) => updCat(view.ci, { description: x })} rows={2} /></Field>
              <MediaField label="Category image" kind="image" slug={slug} value={cat.image} onChange={(x) => updCat(view.ci, { image: x })} />
            </div>
          </SectionCard>
          <SectionCard
            title="Sub-categories"
            description="The groups products are listed under."
            action={<AddButton label="Add sub-category" onClick={() => { updCat(view.ci, { subCategories: [...cat.subCategories, emptySub()] }); setView({ level: "subcategory", ci: view.ci, si: cat.subCategories.length }); }} />}
          >
            <RowList
              items={cat.subCategories}
              emptyText="No sub-categories yet."
              rowKey={(s) => s.id}
              title={(s) => s.name || "Untitled group"}
              sub={(s) => `${s.products.length} products`}
              onOpen={(i) => setView({ level: "subcategory", ci: view.ci, si: i })}
              onRemove={(i) => updCat(view.ci, { subCategories: cat.subCategories.filter((_, idx) => idx !== i) })}
            />
          </SectionCard>
        </>
      ) : null}

      {/* ---- Level: one sub-category ---- */}
      {view.level === "subcategory" && cat && sub ? (
        <>
          <SectionCard title="Sub-category">
            <Field label="Name"><TextInput value={sub.name} onChange={(x) => updSub(view.ci, view.si, { name: x })} placeholder="Substation Systems" /></Field>
          </SectionCard>
          <SectionCard
            title="Products"
            description="Open a product to edit its write-up, image and gallery."
            action={<AddButton label="Add product" onClick={() => { updSub(view.ci, view.si, { products: [...sub.products, emptyProduct()] }); setView({ level: "product", ci: view.ci, si: view.si, pi: sub.products.length }); }} />}
          >
            <RowList
              items={sub.products}
              emptyText="No products yet."
              rowKey={(p) => p.id}
              thumb={(p) => previewSrc(p.image)}
              title={(p) => p.title || "Untitled product"}
              sub={(p) => p.writeUp}
              onOpen={(i) => setView({ level: "product", ci: view.ci, si: view.si, pi: i })}
              onRemove={(i) => updSub(view.ci, view.si, { products: sub.products.filter((_, idx) => idx !== i) })}
            />
          </SectionCard>
        </>
      ) : null}

      {/* ---- Level: one product ---- */}
      {view.level === "product" && prod ? (
        <SectionCard title="Product">
          <div className="space-y-3">
            <Field label="Title"><TextInput value={prod.title} onChange={(x) => updProd(view.ci, view.si, view.pi, { title: x })} /></Field>
            <Field label="Write-up"><TextArea value={prod.writeUp} onChange={(x) => updProd(view.ci, view.si, view.pi, { writeUp: x })} rows={4} /></Field>
            <Field label="Highlights" hint="One per line (optional).">
              <TextArea
                value={(prod.highlights ?? []).join("\n")}
                onChange={(x) => updProd(view.ci, view.si, view.pi, { highlights: x.split("\n").map((h) => h.trim()).filter(Boolean) })}
                rows={3}
              />
            </Field>
            <MediaField label="Main image" kind="image" slug={slug} value={prod.image} onChange={(x) => updProd(view.ci, view.si, view.pi, { image: x })} />
            <ProductGallery slug={slug} gallery={prod.gallery ?? []} onChange={(g) => updProd(view.ci, view.si, view.pi, { gallery: g })} />
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

function Breadcrumb({ crumbs }: { crumbs: { label: string; onClick: () => void }[] }) {
  const back = crumbs[crumbs.length - 2];
  return (
    <div className="flex items-center gap-3">
      {back ? (
        <button
          type="button"
          onClick={back.onClick}
          aria-label="Back"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-teal/40 hover:bg-white/5 hover:text-offwhite"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
      ) : null}
      <nav aria-label="Catalogue path" className="flex flex-wrap items-center gap-1.5 text-sm leading-none">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 ? <span className="text-muted/40">/</span> : null}
              {last ? (
                <span className="max-w-[16rem] truncate font-display font-bold text-offwhite">{c.label}</span>
              ) : (
                <button type="button" onClick={c.onClick} className="max-w-[12rem] truncate font-medium text-muted transition-colors hover:text-teal-light">{c.label}</button>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}

function RowList<T>({
  items,
  emptyText,
  rowKey,
  title,
  sub,
  badge,
  thumb,
  onOpen,
  onRemove,
}: {
  items: T[];
  emptyText: string;
  rowKey: (item: T) => string;
  title: (item: T) => string;
  sub?: (item: T) => string;
  badge?: (item: T) => string;
  thumb?: (item: T) => string;
  onOpen: (index: number) => void;
  onRemove: (index: number) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-navy/30 px-4 py-6 text-center text-xs text-muted">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const t = thumb?.(item);
        return (
          <div key={rowKey(item)} className="group flex items-center gap-3 rounded-lg border border-border bg-navy/40 p-2.5 transition-colors hover:border-teal/40">
            <button
              type="button"
              onClick={() => onOpen(i)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              {thumb ? (
                t ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t} alt="" className="h-10 w-10 shrink-0 rounded-md border border-border/60 object-cover" />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-navy/40 text-[9px] text-muted">img</span>
                )
              ) : null}
              {badge?.(item) ? (
                <span className="shrink-0 rounded bg-teal/15 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-light">{badge(item)}</span>
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-offwhite">{title(item)}</span>
                {sub?.(item) ? <span className="mt-0.5 block truncate text-xs text-muted">{sub(item)}</span> : null}
              </span>
              <span aria-hidden="true" className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M9 6l6 6-6 6" /></svg>
              </span>
            </button>
            <RemoveButton onClick={() => onRemove(i)} />
          </div>
        );
      })}
    </div>
  );
}

function ProductGallery({
  slug,
  gallery,
  onChange,
}: {
  slug: string;
  gallery: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">Gallery (extra photos)</span>
        <AddButton label="Add photo" onClick={() => onChange([...gallery, ""])} />
      </div>
      {gallery.length === 0 ? null : (
        <div className="space-y-2">
          {gallery.map((g, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <MediaField label={`Photo ${i + 1}`} kind="image" slug={slug} value={g} onChange={(x) => onChange(gallery.map((it, idx) => (idx === i ? x : it)))} />
              </div>
              <div className="pt-6">
                <RemoveButton onClick={() => onChange(gallery.filter((_, idx) => idx !== i))} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
