import mongoose from "mongoose";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["mongoose"],
	eslint:{
    ignoreDuringBuilds: true,
  },
  images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},

};

export default nextConfig;
