const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const fs = require('fs');
const webpack = require('webpack');

// Our function that generates our html plugins
function generateHtmlPlugins (templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    // Create new HTMLWebpackPlugin with options
    return new HTMLWebpackPlugin({
      filename: `html/${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    })
  })
}

// Call our function on our views directory.
const htmlPlugins = generateHtmlPlugins('./src/pug/views')



const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const optimization = () => {
    const configObj = {
        splitChunks: {
            chunks:'all'
        }
    };

    if (isProd) {
        configObj.minimizer = [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                  implementation: ImageMinimizerPlugin.imageminMinify,
                  options: {
                    // Lossless optimization with custom option
                    // Feel free to experiment with options for better result for you
                    plugins: [
                      ["gifsicle", { interlaced: true }],
                      ["jpegtran", { progressive: true }],
                      ["optipng", { optimizationLevel: 5 }]
                    ],
                  },
                },
              }),
        ]
    }

    return configObj;
};


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/main.js',
    output: {
        filename:`./js/${filename('js')}`,
        path: path.resolve(__dirname, 'app'),
    },
    devServer: {
        historyApiFallback: true,
        static: path.resolve(__dirname, 'app'),
        open: true,
        compress: true,
        hot: true,
        port: 3000
    },
    plugins: [ 
        
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.pug'),
            filename: 'index.html',
            minify: {
                removeRedundantAttributes: false
              }
        }),

        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:`./css/${filename('css')}`,
        }),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
          })
        
    ].concat(htmlPlugins),
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [

            {
                test: /\.pug$/,
                loader: 'pug-loader',
                exclude:/(node_modules)/,
                options: {
                    pretty: true,
                }
            },


            {
                test: /\.html$/,
                loader: 'html-loader'
            },

            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: () => {
                        return './img/[name][ext]';
                    }
                }
                
            },

            {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: () => {
                        return isDev ? '/fonts/[name][ext]' : '/fonts/[name].[contenthash][ext]';
                    }
                }

            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            
            {
                test:/\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 
                    'postcss-loader', 
                    'sass-loader' 
                ]
            }

        ]
    },
    optimization: optimization(),
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};