const path = require('path');

// Plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// Config
module.exports = {
  entry: './src/app.ts',
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: './src/index.html' }],
    }),
  ],
  module: {
    rules: [
      {
        // Compiles .ts files
        test: /\.ts$/i,
        loader: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        // Compiles styles (and passes them into bundled file)
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        // Maintains png file paths
        test: /\.png$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'images',
          name: '[name].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '%assets%': path.resolve(__dirname, './assets/'),
      '%styles%': path.resolve(__dirname, './sass/'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
