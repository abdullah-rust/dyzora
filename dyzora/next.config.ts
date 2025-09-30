/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... (agar koi aur config pehle se hai to woh yahan rahegi)

  images: {
    // Yeh next/image component ke liye configuration hai
    remotePatterns: [
      {
        // MinIO ka URL (yahan localhost:9000 hai)
        protocol: "http",
        hostname: "localhost",
        port: "9000", // Aapke MinIO ka port
        pathname: "/products/**", // Sirf 'products' bucket ke andar ki images allow karni hain
      },
      // Agar aap MinIO ko Docker container ya kisi aur IP se access kar rahe hain
      // to woh IP bhi yahan add kar sakte hain.
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9000",
        pathname: "/products/**",
      },
    ],
  },

  // ... (agar koi aur config hai)
};

module.exports = nextConfig;
