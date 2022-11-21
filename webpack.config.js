const path = require('path');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const TerserPlugin = require('terser-webpack-plugin');
const globule = require('globule');

const opts = {
  srcDir: path.join(__dirname, 'src'),
  destDir: path.join(__dirname, 'dist'),
};

const htmlPluginConfig = globule
  .find(['html/**/*.html', '!html/**/_*.html'], { cwd: opts.srcDir })
  .map(filename => {
    return new htmlWebpackPlugin({
      filename: `./${filename.slice(5)}`,
      template: `./src/${filename}`,
      scriptLoading: 'blocking',
      inject: 'body',
    });
  });

const froms = {
  ts: path.join(opts.srcDir, 'assets', 'ts', 'index.ts'),
  scss: {
    A: path.join(opts.srcDir, 'assets', 'sass', 'style.scss'),
    // B: path.join(opts.srcDir, 'assets', 'sass', 'hoge.scss'),
  },
};

module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  mode: 'development',

  entry: {
    main: froms.ts,
    'style.min.css': froms.scss.A,
    // 'hoge.min.css': froms.scss.B,
  },
  output: {
    path: opts.destDir,
    filename: 'common/js/[name].js',
    // assetModuleFilename: 'assets/img/[hash][ext]',
    assetModuleFilename: 'assets/img/[name][ext]',
    // publicPath: 'auto',
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/i,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.s?css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   publicPath: '/',
            // },
          },
          'css-loader', //cssの読み込み
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('css-declaration-sorter')({
                    order: 'smacss',
                  }),
                  require('autoprefixer')({
                    grid: 'autoplace',
                  }),
                  require('cssnano')({
                    autoprefixer: false,
                    zindex: true,
                  }),
                ],
              },
            },
          },
          'sass-loader', //sassの読み込み
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp|avif|tiff)$/i,
        // type: 'asset/resource',
        type: 'asset',
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    // 拡張子を配列で指定
    extensions: ['.ts', '.js'],
  },
  devServer: {
    open: {
      app: {
        name: 'chrome',
      },
    },
    liveReload: true,
    watchFiles: './src',
  },
  plugins: [
    ...htmlPluginConfig,
    new BeautifyHtmlWebpackPlugin({
      indent_size: 2,
      indent_char: ' ',
    }),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'common/css/[name]',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          // filename: '[path][name].webp',
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              webp: {
                quality: 50,
                // lossless: true,
              },
              jpeg: {
                quality: 75,
                mozjpeg: true,
              },
              avif: {
                quality: 50,
                // lossless: true,
              },
              png: {
                effort: 7,
              },
              gif: {},
              tiff: {
                quality: 50,
              },
            },
          },
        },
      }),
    ],
  },
  target: ['web', 'es6'],
};
