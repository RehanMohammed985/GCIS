import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory makes Turbopack infer the wrong
  // workspace root; pin it to this project.
  turbopack: {
    root: import.meta.dirname,
  },
  // The preview pane loads the dev server over 127.0.0.1, which Next treats as
  // a cross-origin dev request and blocks by default.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
