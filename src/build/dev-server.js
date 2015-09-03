import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"

import webpackNanoLogs from "webpack-nano-logs"
import WebpackErrorNotificationPlugin from "webpack-error-notification"

import opn from "opn"
import logger from "nano-logger"

const log = logger("webpack-dev-server")

export default (config, options) => {
  options = {
    protocol: "http://",
    host: "0.0.0.0",
    port: 3000,
    open: true,
    noDevEntriesTest: /^tests/,
    ...(options || {}),
  }

  const serverUrl = `${ options.protocol }${ options.host }:${ options .port }`

  const devEntries = [
    `webpack-dev-server/client?${ serverUrl }`,
    `webpack/hot/only-dev-server`,
  ]

  const devConfig = {
    ...config,
    debug: true,
    watch: true,
    colors: true,
    progress: true,
    entry: {
      // add devEntries
      ...Object.keys(config.entry)
        .reduce(
          (acc, key) => {
            // some entries do not need extra stuff
            acc[key] = key.match(options.noDevEntriesTest) !== null
              ? config.entry[key]
              : [
                ...devEntries,
                ...config.entry[key],
              ]
            return acc
          },
          {}
        ),
    },
    plugins: [
      ...(config.plugins || []),
      ...(options.plugins || []),
      new webpack.NoErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      webpackNanoLogs,
      new WebpackErrorNotificationPlugin(),
    ],
    eslint: {
      ...config.eslint,
      emitWarning: true,
    },
  }

  return new WebpackDevServer(
    webpack(devConfig),
    {
      https: options.protocol === "https://",
      contentBase: config.output.path,
      hot: true,
      stats: {
        colors: true,
        // hide all chunk dependencies because it's unreadable
        chunkModules: false,
        // noize
        assets: false,
      },
      noInfo: true,

      // allow all url to point to index.html
      historyApiFallback: true,
    })
    .listen(options.port, options.host, () => {
      log(`Dev server started on ${ serverUrl }`)
      if (options.open) {
        opn(`${ serverUrl }`)
      }
    })
}
