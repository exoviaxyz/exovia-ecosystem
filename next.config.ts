import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Jangan generate AGENTS.md / CLAUDE.md — repo public hanya boleh README.md
  agentRules: false,
  images: {
    formats: ["image/webp"],
  },
};

export default nextConfig;
