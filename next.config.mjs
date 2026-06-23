/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/company/about", permanent: true },
      { source: "/security", destination: "/company/security", permanent: true },
      { source: "/help", destination: "/company/help", permanent: true },
      { source: "/faq", destination: "/company/faq", permanent: true },
      { source: "/legal", destination: "/company/privacy", permanent: true },
      { source: "/privacy", destination: "/company/privacy", permanent: true },
      { source: "/terms", destination: "/company/terms", permanent: true },
      { source: "/company", destination: "/company/about", permanent: false },
    ];
  },
};

export default nextConfig;
