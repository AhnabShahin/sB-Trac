/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Media uploaded/applied through the admin panel is served from the Laravel
    // public storage disk (http://localhost:8000/storage/...). Allow next/image
    // to optimize those. Adjust the host/port here if the API origin changes.
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
    // The backend storage disk runs on localhost in dev, which Next 16 blocks
    // from the image optimizer as a private IP (SSRF guard). The remotePattern
    // above already scopes what can be fetched, so lifting the guard is safe
    // here. In production media is served from a real host and this is a no-op.
    dangerouslyAllowLocalIP: true,
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