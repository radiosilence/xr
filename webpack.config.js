const path = require('path');
const webpack = require('webpack');


module.exports = {
  debug: false,
  entry: {
    xr: ['./src/xr.js'],
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'xr.js',
    library: 'xrl.js',
    libraryTarget: 'umd',
    pathinfo: true,
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^\.\/(en|de|fr|es|pt)$/),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true }),
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
        query: {
          optional: [
          ],
          plugins: [
            'extensible-destructuring:after',
          ],
          blacklist: ['es6.destructuring'],
          stage: 0,
          loose: 'all',
        },
      },
    ],
  },
};
