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
    background: "./src/js/background.js",
    chromereload: "./src/js/chromereload.js"
  },
  output: {
    path: outputPath,
    filename: "scripts/[name].js",
    sourceMapFilename: "map/[file].map"
  },
  devtool: "source-map"
};
