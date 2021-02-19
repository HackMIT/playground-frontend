const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const pages = require('./pages');

const generateConfig = (mode) => {
  return {
    /**
     * Entry
     *
     * The first place Webpack looks to start building the bundle.
     */
    entry: {
      attendance: [`${paths.src}/attendance.js`],
      game: [`${paths.src}/index.jsx`],
      quillsso: [`${paths.src}/quillsso.js`],
      404: [`${paths.src}/404.js`],
    },

    /**
     * Output
     *
     * Where Webpack outputs the assets and bundles.
     */
    output: {
      path: paths.build,
      filename: '[name].bundle.js',
      publicPath: '/',
    },

    /**
     * Plugins
     *
     * Customize the Webpack build process.
     */
    plugins: [
      /**
       * CleanWebpackPlugin
       *
       * Removes/cleans build folders and unused assets when rebuilding.
       */
      new CleanWebpackPlugin(),

      /**
       * CopyWebpackPlugin
       *
       * Copies files from target to destination folder.
       */
      new CopyWebpackPlugin([
        {
          from: paths.static,
          to: '',
          ignore: ['*.DS_Store'],
        },
      ]),

      /**
       * HtmlWebpackPlugin
       *
       * Generates an HTML file from a template.
       */
      ...pages.map(
        (page) =>
          new HtmlWebpackPlugin({
            title: 'Blueprint Playground',
            template: `${paths.src}/${page.template}.html`,
            chunks: ['common', page.template],
            filename:
              mode === 'production' && page.path !== 'index.html'
                ? `${page.path}.html`
                : page.path,
            inject: true,
          })
      ),
    ],

    /**
     * Module
     *
     * Determine how modules within the project are treated.
     */
    module: {
      rules: [
        /**
         * JavaScript
         *
         * Use Babel to transpile JavaScript files.
         */
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader'],
        },

        /**
         * Styles
         *
         * Inject CSS into the head with source maps.
         */
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: true, importLoaders: 1 },
            },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
        },

        /**
         * Images
         *
         * Copy image files to build folder.
         */
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            context: 'src', // prevent display of src/ in filename
          },
        },

        /**
         * Fonts
         *
         * Inline font files.
         */
        {
          test: /\.(woff(2)?|eot|ttf|otf|)$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[path][name].[ext]',
            context: 'src', // prevent display of src/ in filename
          },
        },

        /**
         * Models
         *
         * Copy 3D models to build folder.
         */
        {
          test: /\.(glb)$/,
          loader: 'url-loader',
          options: {
            name: '[path][name].[ext]',
            context: 'src',
          },
        },
      ],
    },
  };
};

module.exports = generateConfig;
