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
      {
        protocol: "https",
        hostname: "api-btrac.missandmrselegancebd.com",
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
    // Caching disabled: the optimizer re-fetches/re-optimizes on each request so
    // edited artwork propagates immediately instead of being held for a TTL.
    minimumCacheTTL: 0,
  },
  // Force the browser never to store the static /public images, so a replaced
  // file shows on the next request without a manual cache-clear. The optimizer
  // route (/_next/image) is left alone — overriding its Cache-Control breaks
  // Next dev; minimumCacheTTL:0 above already makes it revalidate every request.
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;