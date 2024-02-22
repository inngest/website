import * as path from "path";
import { parse } from "acorn";

const VARIABLE_NODE_TYPE = "mdxjsEsm";
const VARIABLE_NAME = "sourceFilePath";

/**
 * Exports the MDX file path, relative to the project root
 **/
export function remark() {
  return function transformer(ast, vFile, next) {
    // find current file path relative to project root
    const [filePath] = vFile.history;
    const relative = path.relative(vFile.cwd, filePath);

    // add it as an export statement to the top of the file to make it
    // available on Next.js pageProps (via the recma-nextjs-static-props plugin)
    ast.children.unshift({
      type: VARIABLE_NODE_TYPE,
      value: `export const ${VARIABLE_NAME} = ${JSON.stringify(relative)}`,
    });

    if (typeof next === "function") {
      return next(null, ast, vFile);
    }

    return ast;
  };
}

/**
 * Preserves the MDX file path export when processing through rehype
 **/
export function rehype() {
  return function transformer(ast) {
    const def = ast.children.find(
      (node) =>
        node.type === VARIABLE_NODE_TYPE && node.value.includes(VARIABLE_NAME)
    );

    // add estree metadata to the node, or it will not be picked up by recma-nextjs-static-props
    // not sure why this is necessary, following pattern from existing rehypeAddMDXExports plugin
    if (def) {
      def.data = {
        estree: parse(def.value, {
          sourceType: "module",
          ecmaVersion: "latest",
        }),
      };
    }
  };
}
