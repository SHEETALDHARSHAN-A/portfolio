/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Lint debt predates the build pipeline; don't fail deploys on it.
        // Run `npx next lint` locally to see and burn down the list.
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['images.unsplash.com'], // Legacy fallback
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
