'use strict'

/**
 * Turbopack-compatible MDX loader.
 *
 * @next/mdx registers mdx-js-loader as a Turbopack rule and passes remark/rehype/recma
 * plugin functions as loader options. Turbopack requires serializable (plain JSON) options,
 * so passing JS functions fails. This loader imports all plugins internally — no function
 * options are passed through Turbopack's serialization layer.
 */

const mdxLoader = require('@mdx-js/loader')
const { pathToFileURL } = require('node:url')
const path = require('path')

let cachedPlugins = null

async function loadPlugins() {
  if (cachedPlugins) return cachedPlugins

  const mdxDir = __dirname
  const [remarkMod, rehypeMod, recmaMod] = await Promise.all([
    import(pathToFileURL(path.join(mdxDir, 'remark.mjs')).href),
    import(pathToFileURL(path.join(mdxDir, 'rehype.mjs')).href),
    import(pathToFileURL(path.join(mdxDir, 'recma.mjs')).href),
  ])

  cachedPlugins = {
    remarkPlugins: remarkMod.remarkPlugins,
    rehypePlugins: rehypeMod.rehypePlugins,
    recmaPlugins: recmaMod.recmaPlugins,
  }
  return cachedPlugins
}

module.exports = function mdxTurbopackLoader(source) {
  // Replicate webpack's ignore-loader behavior for MDX files in _-prefixed directories
  // (e.g. pages/patterns/_patterns/*.mdx are content files, not standalone routes)
  if (/\/_\w+\//.test(this.resourcePath || '')) {
    const cb = this.async()
    cb(null, 'export default function IgnoredPage() { return null }')
    return
  }

  const callback = this.async().bind(this)
  const loaderContext = this

  loadPlugins()
    .then(({ remarkPlugins, rehypePlugins, recmaPlugins }) => {
      const mdxOptions = {
        providerImportSource: 'next-mdx-import-source-file',
        remarkPlugins,
        rehypePlugins,
        recmaPlugins,
      }

      const proxy = new Proxy(loaderContext, {
        get(target, prop, receiver) {
          if (prop === 'getOptions') return () => mdxOptions
          if (prop === 'async') return () => callback
          return Reflect.get(target, prop, receiver)
        },
      })

      mdxLoader.call(proxy, source)
    })
    .catch((err) => callback(err))
}
