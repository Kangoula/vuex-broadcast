const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  plugins: [new CleanWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vuex-broadcast.js',
    library: 'vuexBroadcast',
    libraryTarget: 'umd'
  }
}
