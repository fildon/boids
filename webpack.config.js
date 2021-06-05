const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: "./src/entry.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
    modules: [path.resolve("./node_modules"), path.resolve("./src")],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(),
  },
};
