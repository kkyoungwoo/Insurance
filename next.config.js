/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
        domains: ['theme.dsngrid.com'],
        formats: ['image/webp']
    },
    typescript: {
        ignoreBuildErrors: true, // TypeScript 오류 무시
      },
      eslint: {
        ignoreDuringBuilds: true, // ESLint 오류 무시
      },
    // i18n: {
    //     locales: ["en"],
    //     defaultLocale: "en",
    // },
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true,
    }

}