const { resolve } = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OS = require("os");
const environments = require("../config/environments");
const version = require("../package").version;

module.exports = (env, argv) => {
  const envValue = env && env.env || "production";
  const environment = environments[envValue];

  return {
    mode: envValue,
    entry: {
      main: "./example/main.js"
    },

    output: {
      path: resolve(__dirname, "../dist"),
      filename: `[name]-v${version}.js`
    },

    resolve: {
      modules: [resolve(__dirname, "src"), "node_modules"],
      extensions: [".js", ".json"]
    },

    externals: {
      react: "React",
      "react-dom": "ReactDOM"
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/], //不通过该babel处理，提高打包速度。
          // include: [/src/], //指定打包范围
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: [
                "@babel/plugin-proposal-class-properties",
              ]
            }
          }
        },
        {
          test: /\.(css|scss|less)$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 3 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader. 在css-loader之后，指定几个loader处理import的css
              }
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: [
                  //require('autoprefixer')
                ]
              }
            },
            {
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.(jpg|png|jpeg|gif|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {}
            }
          ]
        }
      ]
    },

    plugins: [
      // new BundleAnalyzerPlugin(),

      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
        inject: false, // 打包之后js放置在那里 body header false不引入打包后的js
        chunks: ["main"],
        title: `${environment.title}`,
        publicURL: "//assert.ruoru.me"
      }),

      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(`${environment.key}`),
          GATEWAY_ENV: JSON.stringify(`${environment.key}`)
        }
      }),

      new webpack.HotModuleReplacementPlugin(),
    ],

    optimization: {
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          parallel: true, // 启用/禁用多进程并发运行功能。
        }),
        new OptimizeCSSAssetsPlugin({}),
      ]
    },

    devServer: {
      open: true,
      inline: true,
      publicPath: "/",
      contentBase: resolve(__dirname, "../dist"),
      compress: true, //启用所有服务的gzip压缩
      // https: true,
      host: "localhost", //getIPAdress() ||
      port: 8200,
      historyApiFallback: {
        index: "/index.html"
      }

      //lazy: true,    //当lazy启用时，当它被请求的DEV-服务器将只编译软件包。这意味着webpack不会看到任何文件更改。我们称这个懒惰模式。
      //filename: '[name].bundle.js',    ///[name].bundle.js请求时才编译 。filename在没有延迟模式的情况下使用时不起作用。
    }
  };
};

//获取本机ip
function getIPAdress() {
  const interfaces = OS.networkInterfaces();
  for (let devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
