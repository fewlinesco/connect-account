// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  trailingSlash: true,
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
  future: {
    webpack5: true,
  },
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
  productionBrowserSourceMaps: true,
};

const SentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
