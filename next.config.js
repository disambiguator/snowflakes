module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "snowflakes-disambiguous.s3.amazonaws.com",
        pathname: "/**.png",
      },
    ],
  },
};
