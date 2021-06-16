module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;

      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }

    config.module.rules.push({
      test: /\.(png|svg|jpg|gif|eot|ttf|woff|woff2)$/,
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

    return config;
  },
};
