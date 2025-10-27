/** @type {import('next').NextConfig} */
const nextConfig = {
    // Menambahkan pengaturan timeout untuk Static Site Generation (SSG)
    // Nilai dalam detik. Di sini diatur menjadi 120 detik (2 menit).
    staticPageGenerationTimeout: 180, 

    images: {
        domains: ['localhost'], // Add localhost to the allowed domains
    }
};

export default nextConfig;