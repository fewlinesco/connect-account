module.exports = {
  webpack(config, options) {
    const { isServer } = options;

    config.module.rules.push({
      test: /\.(png|svg|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 8192,
          fallback: "file-loader",
          publicPath: "/_next/static/images/",
          outputPath: `${isServer ? "../" : ""}static/images/`,
          name: "[name]-[hash].[ext]",
          esModule: false,
        },
      },
    });
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }
    return config;
  },
};
