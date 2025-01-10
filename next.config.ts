const nextConfig = {
	serverExternalPackages: ["pino", "mongoose"],
	eslint: {
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

module.exports = nextConfig;
