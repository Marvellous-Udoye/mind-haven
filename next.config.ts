import withPWAInit from "next-pwa";

const nextConfig = {
  turbopack: {}, 
};

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);