/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next 16 negotiates AVIF first and falls back to WebP, which is well below
    // the weight of the source JPEG/PNG for essentially every asset here.
    formats: ["image/avif", "image/webp"],
    // The largest asset is the ~1672px-wide service banner, which is displayed
    // full-bleed. Without this, `deviceSizes` tops out at 3840px and every
    // responsive candidate is generated wider than it can ever be displayed.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    // Long enough that a repeat visit is served from cache without re-running the
    // optimizer, short enough that edited artwork still propagates in a day.
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;