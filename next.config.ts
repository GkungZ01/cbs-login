import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.0.44:3000",
    "192.168.0.44",
    // สำคัญ: ต้องใส่โปรโตคอล (http:// หรือ https://) ให้ครบถ้วน
  ],
};

export default nextConfig;
