module.exports = {
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: "/blog/:year/:month/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
};
