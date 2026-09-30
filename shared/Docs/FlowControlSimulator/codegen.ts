import { fmtSeconds, type KeyMode, type SimConfig } from "./engine";

const TENANT_KEY = "event.data.tenant_id";

const keyLine = (mode: KeyMode, pad: string) =>
  mode === "tenant" ? `${pad}key: "${TENANT_KEY}",\n` : "";

function priorityExpr(cfg: SimConfig): string {
  const nonZero = cfg.tenants.filter((t) => t.priority !== 0);
  if (!nonZero.length) return '"0"';
  const expr = nonZero.reduceRight(
    (acc, t) =>
      `${TENANT_KEY} == '${t.id}' ? ${Math.max(
        -600,
        Math.min(600, t.priority)
      )} : ${acc}`,
    "0"
  );
  return `"${expr}"`;
}

/** TypeScript SDK (v4) function config for the simulator settings. */
export function generateCode(cfg: SimConfig): string {
  const p = "    ";
  let o = "";
  if (cfg.rateLimit.enabled) {
    o += `${p}rateLimit: {\n${p}  limit: ${
      cfg.rateLimit.limit
    },\n${p}  period: "${fmtSeconds(cfg.rateLimit.period)}",\n${keyLine(
      cfg.rateLimit.key,
      `${p}  `
    )}${p}},\n`;
  }
  if (cfg.batching.enabled) {
    o += `${p}batchEvents: {\n${p}  maxSize: ${
      cfg.batching.maxSize
    },\n${p}  timeout: "${fmtSeconds(cfg.batching.timeout)}",\n${keyLine(
      cfg.batching.key,
      `${p}  `
    )}${p}},\n`;
  }
  if (cfg.debounce.enabled) {
    o += `${p}debounce: {\n${p}  period: "${fmtSeconds(
      cfg.debounce.period
    )}",\n`;
    if (cfg.debounce.useTimeout)
      o += `${p}  timeout: "${fmtSeconds(cfg.debounce.timeout)}",\n`;
    o += keyLine(cfg.debounce.key, `${p}  `);
    o += `${p}},\n`;
  }
  if (cfg.singleton.enabled) {
    o += `${p}singleton: {\n${p}  key: ${
      cfg.singleton.key === "tenant" ? `"${TENANT_KEY}"` : `'"global"'`
    },\n${p}  mode: "${cfg.singleton.mode}",\n${p}},\n`;
  }
  if (cfg.priority.enabled) {
    o += `${p}priority: {\n${p}  run: ${priorityExpr(cfg)},\n${p}},\n`;
  }
  if (cfg.throttle.enabled) {
    o += `${p}throttle: {\n${p}  limit: ${
      cfg.throttle.limit
    },\n${p}  period: "${fmtSeconds(cfg.throttle.period)}",\n`;
    if (cfg.throttle.burst) o += `${p}  burst: ${cfg.throttle.burst},\n`;
    o += keyLine(cfg.throttle.key, `${p}  `);
    o += `${p}},\n`;
  }
  {
    const cs = cfg.concurrency.constraints.map((c) => {
      const parts = [`limit: ${c.limit}`];
      if (c.scope !== "fn") parts.push(`scope: "${c.scope}"`);
      if (c.key === "tenant") parts.push(`key: "${TENANT_KEY}"`);
      if (c.key === "shared") parts.push(`key: '"external-api"'`);
      return `{ ${parts.join(", ")} }`;
    });
    const simple =
      cs.length === 1 &&
      cfg.concurrency.constraints[0].key === "none" &&
      cfg.concurrency.constraints[0].scope === "fn";
    if (simple)
      o += `${p}concurrency: ${cfg.concurrency.constraints[0].limit},\n`;
    else if (cs.length === 1) o += `${p}concurrency: ${cs[0]},\n`;
    else
      o += `${p}concurrency: [\n${cs
        .map((c) => `${p}  ${c},`)
        .join("\n")}\n${p}],\n`;
  }
  if (cfg.startTimeout.enabled) {
    o += `${p}timeouts: { start: "${fmtSeconds(
      cfg.startTimeout.seconds
    )}" },\n`;
  }

  const handlerArg = cfg.batching.enabled ? "events" : "event";
  let body = "";
  let runN = 0;
  let sleepN = 0;
  for (const s of cfg.steps) {
    if (s.kind === "run") {
      runN++;
      body += `    await step.run("step-${runN}", () => doWork()); // ~${fmtSeconds(
        s.duration
      )}\n`;
    } else {
      sleepN++;
      body += `    await step.sleep("wait-${sleepN}", "${fmtSeconds(
        s.duration
      )}");\n`;
    }
  }

  return `export const myFunction = inngest.createFunction(
  {
    id: "my-function",
    triggers: { event: "app/job.requested" },
${o}  },
  async ({ ${handlerArg}, step }) => {
${body}  }
);`;
}
