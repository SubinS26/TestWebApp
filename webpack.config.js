const { join } = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')

const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('--mode=production')

const plugins = [
  'react-html-attrs',
  'transform-class-properties',
  'transform-decorators-legacy',
]

if (!isProd) {
  plugins.push('transform-react-jsx-source')
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: join(__dirname, '/dist/js/'),
    filename: 'bundle.js',
  },
  mode: isProd ? 'production' : 'development',
  performance: {
    hints: false,
  },
  optimization: {
    minimize: isProd,
    nodeEnv: isProd ? 'production' : 'development',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['env', { targets: { browsers: ['> 1%', 'last 2 versions'] }, modules: false }],
            'react',
            'stage-0',
          ],
          plugins: plugins,
        },
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format:
        '  build [:bar] ' +
        chalk.green.bold(':percent') +
        ' (:elapsed seconds)',
    }),
  ],
}
