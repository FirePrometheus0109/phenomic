import color from "chalk"
import nanoLogger from "nano-logger"

import toStaticHtml from "./to-html"
import postBuild from "./postbuild"

const log = nanoLogger("statinamic/lib/static")

export default (config) => (
  toStaticHtml(config)
  .then(files => postBuild(config, files, log))
  .catch((error) => {
    log(color.red(`✗ Static build failed`))
    setTimeout(() => {
      throw error
    }, 1)
  })
)
