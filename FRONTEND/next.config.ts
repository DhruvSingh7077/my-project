import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // This ensures Next.js knows your project root
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
