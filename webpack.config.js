const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  //context: path.join(__dirname, 'src'),
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/static' }
      ]
    })
  ]
};
