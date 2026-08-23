import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    experimental: {
    // Turbopack's persistent on-disk dev cache pegs CPU on this machine
    // (thousands of open .sst/.meta handles under .next/dev/cache/turbopack
    // with sustained ~700% CPU even at idle, no file changes). Disable it
    // until the upstream issue is fixed: https://github.com/vercel/next.js/issues/93896
    turbopackFileSystemCacheForDev: false,
  },
}

export default nextConfig
