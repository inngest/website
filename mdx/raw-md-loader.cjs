'use strict'

/**
 * Raw text loader for .md files imported as strings.
 * Used by Turbopack since webpack's `asset/source` module type
 * is not available in Turbopack's rule configuration.
 */
module.exports = function rawMdLoader(source) {
  return `export default ${JSON.stringify(source)}`
}
