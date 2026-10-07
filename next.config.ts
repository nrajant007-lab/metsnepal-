import type { NextConfig } from "next";
import { resolve } from 'node:path';

const nextConfig: NextConfig = {
  webpack(config, { webpack }) {
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /^cloudflare:workers$/,
      resolve(process.cwd(), 'lib/runtime-env.vercel.ts'),
    ));
    return config;
  },
};

export default nextConfig;
