const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const tsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const Dotenv = require("dotenv-webpack");

const mode = slsw.lib.webpack.isLocal ? "development" : "production";

module.exports = {
  target: "node",
  devtool: slsw.lib.webpack.isLocal
    ? "eval-cheap-module-source-map"
    : "source-map",
  mode,
  entry: slsw.lib.entries,
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, ".webpack"),
    filename: "[name].js",
  },
  optimization: {
    minimize: false,
  },
  externals: [nodeExternals()],
  resolve: {
    plugins: [new tsconfigPathsPlugin()],
    extensions: [".js", ".ts", ".json"],
    modules: [__dirname, "node_modules"],
    symlinks: false,
    cacheWithContext: false,
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loader: "ts-loader",
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".serverless"),
            path.resolve(__dirname, ".webpack"),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./node_modules/.prisma/client/schema.prisma", to: "./" },
      ],
    }),
    // new Dotenv({
    //   systemvars: true,
    // }),
  ],
};
