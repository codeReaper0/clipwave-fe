import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  images: {
    domains: ["res.cloudinary.com", "upload-widget.cloudinary.com"],
  },
};

export default nextConfig;
