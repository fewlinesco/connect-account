/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require("next-transpile-modules")([
  "@react-aria/ssr",
  "@react-aria/link",
  "@react-aria/button",
]);

module.exports = withTM({
  webpack(config, options) {
    const { isServer } = options;

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

    if (!isServer) {
      config.node = {
        fs: "empty",
      };

      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }

    config.optimization.minimize = false;

    return config;
  },
});
