import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   /* config options here */
   experimental: {
      serverActions: {
         bodySizeLimit: '10mb',
      },
   },
   images: {
      domains: ['github.com', 'loremflickr.com', 'picsum.photos'],
   },
}

export default nextConfig
