const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve()
  }
};
