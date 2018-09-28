const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const outputRelativePath = "build";
const outputPath = path.join(__dirname, outputRelativePath);

module.exports = {
  mode: "production",
  plugins: [
    new CopyWebpackPlugin([
      { from: "src/manifest.json", to: "" },
      { from: "src/images", to: "images" },
      { from: "src/locales", to: "_locales" }
    ]),
    new CleanWebpackPlugin(outputRelativePath),
    new webpack.ProgressPlugin()
  ],
  entry: {
    background: "./src/js/background.js"
  },
  output: {
    path: outputPath,
    filename: "scripts/[name].js",
    sourceMapFilename: "map/[file].map"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ]
  },
  devtool: "source-map",
  watch: true
};
