/* Production build:
  ========================================================================== */
const { merge } = require('webpack-merge')
const defines = require('./webpack-defines')
const CompressionPlugin = require('compression-webpack-plugin')  // 添加这行

// plugins for production build only:
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// default config
const commonConfig = require('./webpack.common.js')

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: false,
  output: {
    path: defines.dist,
    // 添加缓存相关配置
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    clean: true
  },
  // 添加缓存配置
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    },
    name: 'production-cache'
  },
  plugins: [
    new CompressionPlugin({
      exclude: /\/static/,
    }),
  ],
  module: {
    rules: []
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  optimization: {
    minimize: true,
    usedExports: true, // 标记未使用的导出
    sideEffects: true, // 启用副作用标记
    minimizer: [
      new JsonMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          format: {
            comments: false // 删除注释
          }
        },
        extractComments: false // 不将注释提取到单独的文件中
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          // no ie please!
          // targets: { ie: 11 },
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ]
  }
})
