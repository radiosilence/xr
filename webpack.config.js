const webpack = require('webpack');
const fs = require('fs');
const babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));

module.exports = {
  debug: false,
  entry: {
    xr: ['./src/xr.js'],
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'xr.js',
    library: 'xr.js',
    libraryTarget: 'umd',
    pathinfo: true,
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        drop_console: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|vendor/,
        loader: 'babel',
        query: babelConfig,
      },
    ],
  },
};
