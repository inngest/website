/**
 * Shared snippet processing utilities.
 * Used by both rehype.mjs for MDX processing and the docs-markdown API route.
 */

/**
 * Format a snippet file's content by:
 * - Extracting content between !snippet:start and !snippet:end markers
 * - Removing sequential empty lines
 * - Trimming leading/trailing whitespace lines
 * - De-indenting content
 */
export function formatSnippetFileContent(content) {
  let sourceLines = content.split("\n");

  let parsedLines = [];
  for (let i = 0; i < sourceLines.length; i++) {
    const line = sourceLines[i];
    if (i > 0 && line.trim() === "" && sourceLines[i - 1].trim() === "") {
      // This is a sequential empty line, so we must exclude it. In other words,
      // both this line and the previous line are empty
      continue;
    }

    if (isSnippetStart(line)) {
      // There's a start marker, so we must exclude all previous lines
      parsedLines = [];
      continue;
    } else if (isSnippetEnd(line)) {
      // There's an end marker, so we must exclude all subsequent lines
      break;
    }
    parsedLines.push(line);
  }

  // Remove leading whitespace lines
  for (let line of parsedLines) {
    if (line.trim() !== "") {
      break;
    }
    parsedLines.shift();
  }

  // Remove trailing whitespace lines
  for (let i = parsedLines.length - 1; i >= 0; i--) {
    if (parsedLines[i].trim() !== "") {
      break;
    }
    parsedLines.pop();
  }

  // Use this to trim left whitespace if necessary. This will prevent codeblocks
  // where everything is indented (e.g. code in a function)
  const leftWhitespaceToTrim = parsedLines[0]?.match(/^\s*/)?.[0] || "";

  parsedLines = parsedLines.map((line) => {
    if (line.startsWith(leftWhitespaceToTrim)) {
      return line.substring(leftWhitespaceToTrim.length);
    }
    return line;
  });

  return parsedLines.join("\n");
}

/**
 * Check if a line marks the start of a snippet
 */
export function isSnippetStart(line) {
  // Python
  if (line.trim() === "# !snippet:start") {
    return true;
  }

  // TypeScript, Go
  if (line.trim() === "// !snippet:start") {
    return true;
  }

  return false;
}

/**
 * Check if a line marks the end of a snippet
 */
export function isSnippetEnd(line) {
  // Python
  if (line.trim() === "# !snippet:end") {
    return true;
  }

  // TypeScript, Go
  if (line.trim() === "// !snippet:end") {
    return true;
  }

  return false;
}
