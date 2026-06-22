/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'res.cloudinary.com'],  // Add localhost and cloudinary to the allowed domains
    }
};

export default nextConfig;
