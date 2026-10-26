import fs from "node:fs";
let f = "sandbox/group.ts";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error(a); s = s.replace(a, b); };
rep(`import { cleanupRegistrarOf } from "./cleanup.ts";
`, `import { cleanupRegistrarOf } from "./cleanup.ts";
import { getSandboxError } from "./protocol.ts";
`);
rep(`      const sandbox = await tools.create({ ...steps.create, id }, options);

      try {`, `      const sandbox = await tools
        .create({ ...steps.create, id }, options)
        .catch((error: unknown) => {
          // The name belongs to a sandbox this scope never acquired, which its
          // cleanup must not destroy.
          if (getSandboxError(error)?.code === "sandbox_name_taken") {
            cleanup?.abort();
          }

          throw error;
        });

      try {`);
fs.writeFileSync(f, s);
f = "InngestCommHandler.ts";
s = fs.readFileSync(f, "utf8");
rep(`    if (this.rawFns.length !== (options.functions ?? []).length) {`, `    if (servedFns.length !== (options.functions ?? []).length) {`);
fs.writeFileSync(f, s);
