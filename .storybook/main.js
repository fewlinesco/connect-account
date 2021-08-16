const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  "stories": [
    "../src/**/*.stories.tsx"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins = [new TsconfigPathsPlugin()];

    // This line is needed to be able to launch the Storybook server
    // related issue : https://github.com/webpack-contrib/css-loader/issues/447
    config.node = { fs: "empty" };

    return config;
}
}
