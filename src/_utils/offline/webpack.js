// @flow

import { resolve } from "path"
import { sync as globSync } from "globby"
import OfflinePlugin from "offline-plugin"
import joinUri from "url-join"

const runtimeEntry = resolve(__dirname, "runtime.js")

export const offlinePlugin = (config: PhenomicConfig): Array<Object> => {
  if (!config.offline) {
    return []
  }

  const assets = globSync([ "**/*" ], {
    cwd: config.assets.path,
    nodir: true,
  })
  .map((asset) => joinUri(config.assets.route, asset))

  function preparePatterns(patterns: ?Array<string>) {
    if (!patterns) {
      return []
    }

    return patterns.reduce((acc, pattern) => {
      return (
        pattern === ":assets:"
        ? [ ...acc, ...assets ]
        : [ ...acc, pattern ]
      )
    }, [])
  }

  return [
    new OfflinePlugin({
      publicPath: config.baseUrl.pathname,
      // https://github.com/NekR/offline-plugin/issues/58
      relativePaths: false,

      // Use this option to explicitely cache files not generated by webpack
      externals: [
        "/", // generated by phenomic static build, after webpack
        ...assets,
      ],

      // every webpack generated assets have hashes, so we can safely
      // inform OfflinePlugin about that
      safeToUseOptionalCaches: true,

      caches: {
        // `main` files will be loaded during SW install
        main: preparePatterns(config.offlineConfig.cachePatterns.onInstall),

        // `additional` files are loaded after main section
        // and do not prevent SW to install.
        additional: preparePatterns(
          config.offlineConfig.cachePatterns.afterInstall
        ),

        // `optional` files will be cached only when requested
        optional: preparePatterns(config.offlineConfig.cachePatterns.onDemand),
      },
      // for more advanced usage, see documentation of the plugin
      // https://github.com/NekR/offline-plugin/blob/master/docs/caches.md

      excludes: config.offlineConfig.cachePatterns.excludes,

      ServiceWorker: {
        navigateFallbackURL: "/",
      },

      // Appcache Fallback for browser that does not support Service Worker
      // (eg: Safari, IE, Edge...)
      Appcache: {
        // Appcache does not offer the ability to cache resources with
        // multiple conditions, so you must explicitely choose section
        // defined above that will be downloaded during appcache
        // install/update
        caches: [
          ...config.offlineConfig.appcache.onInstall ? [ "main" ] : [],
          ...config.offlineConfig.appcache.afterInstall? [ "additional" ] : [],
          // ...config.offlineConfig.appcache.onDemand ? [ "optional" ] : [],
        ],
        FALLBACK: {
          "/": "/index.html",
        },
      },

      // For more options, check out the documentation
      // https://www.npmjs.com/package/offline-plugin
      // You can also tweak the runtime part in
      // `scripts/phenomic.browser.js`
    }),
  ]
}

export const offlineEntry = (config: PhenomicConfig): Array<string> => {
  if (!config.offline) {
    return []
  }

  return [
    runtimeEntry,
  ]
}
