import fs from "node:fs";
const f = "sandbox/cleanup.test.ts";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error(a); s = s.replace(a, b); };
rep(`import { runFnWithStack }`, `import { vi } from "vitest";
import { runFnWithStack }`);
rep(`import { withMiddlewareFunctions } from "../InngestCommHandler.ts";`, `import { internalLoggerSymbol } from "../Inngest.ts";
import {
  InngestCommHandler,
  withMiddlewareFunctions,
} from "../InngestCommHandler.ts";`);
rep(`      } else if (op.op === StepOpCode.StepRun) {
        stepState = {
          ...stepState,
          [op.id]: { id: op.id, data: op.data },
        };
      }`, `      } else if (op.op === StepOpCode.StepRun) {
        stepState = {
          ...stepState,
          [op.id]: { id: op.id, data: op.data },
        };
      } else if (op.op === StepOpCode.StepError) {
        stepState = {
          ...stepState,
          [op.id]: { id: op.id, error: op.error },
        };
      }`);
rep(`  test.each([
    { name: "group.sandbox()", requests: 1 },`, `  test("group.sandbox() aborts it when the name belongs to another sandbox", async () => {
    const client = createClient((path, method) => {
      if (path === "/v2/sandboxes" && method === "POST") {
        return Response.json(
          { errors: [{ code: "sandbox_name_taken", message: "name taken" }] },
          { status: 409 },
        );
      }

      return undefined;
    });
    const fn = client.createFunction(
      { id: "grouped", triggers: [{ event: "sandbox/cleanup" }] },
      async ({ group }) => {
        await group.sandbox("box", async () => undefined);
      },
    );

    const defers = await runForRequests(fn, 5);

    expect(names(defers)).toEqual([
      "DeferAdd:box:cleanup",
      "DeferAbort:box:cleanup",
    ]);
  });

  test.each([
    { name: "group.sandbox()", requests: 1 },`);
s = s.replace(/\n\}\);\n$/, `

  test("a valid served list does not warn that functions are undefined", () => {
    const { client } = createScopeClient();
    const warn = vi
      .spyOn(client[internalLoggerSymbol], "warn")
      .mockImplementation(() => undefined);
    const fn = buildScoped(client);

    new InngestCommHandler({
      client,
      frameworkName: "test",
      functions: [fn],
      handler: () => {
        return {} as never;
      },
    });

    expect(warn).not.toHaveBeenCalled();
  });
});
`);
fs.writeFileSync(f, s);
