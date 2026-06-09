"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";
import Logo from "@/components/v1/Logo";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import DocsCtaPair from "@/components/v1/sections/CompareTemporal/DocsCtaPair";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import {
  tokenizeCode,
  renderTokens,
} from "@/components/v1/sections/shared/codeHighlight";

/**
 * "Eliminating Temporal's infrastructure tax" — side-by-side code
 * comparison. Left column
 * (Temporal) stacks the three files Temporal makes you ship —
 * activities.ts, workflow.ts, worker.ts; right column (Inngest) is
 * workflows.ts + server.ts. Each column is a 2px white-bordered box
 * (`p-32`, `gap-32`); the inner code panel carries a near-black
 * vertical gradient and a hairline gray border, with each snippet
 * separated by a top divider.
 *
 * Code is rendered through a small semantic highlighter:
 * salmon keywords, green function-declaration names,
 * blue object keys / typed params, green strings, light-salmon numbers,
 * grey comments — everything else inherits frost.
 */

// ---- snippets (verbatim) -------------------------------------------

const ACTIVITIES_TS = `export async function getUser(userId: string) {
  const user = await db.getUser(userId);
  if (!user) {
    throw InvalidAccountError('User not found');
  }
  return user;
}
export async function sendWelcomeEmail(email: string) {
  // ...
}
export async function startTrial(userId: string) {
  // ...
}`;

const WORKFLOW_TS = `import { proxyActivities } from '@temporalio/workflow';
import { ApplicationFailure } from '@temporalio/common';

export async function welcomeWorkflow(
  userSignup: { id: string }
) {
  const {
    getUser,
    sendWelcomeEmail,
    startTrial
  } = proxyActivities<typeof activities>({
    retry: {
      initialInterval: '1 second',
      maximumInterval: '1 minute',
      backoffCoefficient: 2,
      maximumAttempts: 4,
      nonRetryableErrorTypes: ['InvalidAccountError'],
    },
    startToCloseTimeout: '1 minute',
  });

  const user = await getUser(userSignup.id);

  await sendWelcomeEmail(user.email);

  try {
    await startTrial(user.id);
  } catch (e) {
    throw ApplicationFailure.create({
      message: 'Failed to start trial'
    });
  }

  return 'Workflow complete';
}`;

const WORKER_TS = `import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import { namespace, taskQueueName } from './shared';

async function run() {
  // Workflows are loaded from the workflowsPath
  // which modifies the code at runtime
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    namespace: 'acme-app',
    taskQueue: 'user-workflows',
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});`;

const WORKFLOWS_TS = `import { Inngest, NonRetriableError } from 'inngest';

export const inngest = new Inngest({
  id: 'acme-app',
});

export const welcomeWorkflow = inngest.createFunction(
  { id: 'welcome-workflow', retries: 4 },
  { event: 'user.signup'},
  async ({ event, step }) => {
    const user = await step.run('get-user', async () => {
      const user = await db.getUser(userId);
      if (!user) {
        throw NonRetriableError('User not found');
      }
      return user;
    });

    await step.run('send-welcome-email', async () => {
      await sendWelcomeEmail(user.email);
    });

    await step.run('start-trial', async () => {
      await startTrial(user.id);
    });

    return 'Workflow complete';
  }
)`;

const SERVER_TS = `import { serve } from 'inngest/express';
import { inngest, welcomeWorkflow } from './workflows';

app.use('/api/inngest', serve({
  client: inngest,
  functions: [welcomeWorkflow]
}));

app.listen(3000);`;

// ---- highlighter ---------------------------------------------------
// Full shared palette: this panel colours every token kind.
function Highlighted({ code }: { code: string }) {
  return (
    <pre className="w-full overflow-x-auto whitespace-pre font-v1Mono text-[13px] leading-[1.9] text-v1-frost [scrollbar-width:thin] sm:text-[16px]">
      {renderTokens(tokenizeCode(code))}
    </pre>
  );
}

// ---- code panel ----------------------------------------------------

// Near-black vertical gradient behind each code panel.
const PANEL_GRADIENT =
  "linear-gradient(-82.3891deg, rgba(33, 33, 33, 0) 2.2521%, rgb(2, 2, 2) 46.831%)";
const HAIRLINE = "rgba(124,124,124,0.35)";

function Snippet({ label, code, first }: { label: string; code: string; first?: boolean }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-3 px-4 pb-[20px] pt-4 sm:px-6",
        !first && "border-t",
      )}
      style={!first ? { borderColor: HAIRLINE } : undefined}
    >
      {/* Filename row — 12px frost square glyph + 18px mono label. */}
      <div className="flex w-full items-center gap-1">
        <span aria-hidden="true" className="flex w-[18px] shrink-0 justify-center">
          <span className="block size-[12px] bg-v1-frost" />
        </span>
        <span className="font-v1Mono text-[18px] leading-[1.5] text-v1-frost">
          {label}
        </span>
      </div>
      {/* Code is indented to sit under the filename text (icon + gap). */}
      <div className="w-full pl-[23px]">
        <Highlighted code={code} />
      </div>
    </div>
  );
}

function CodePanel({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex w-full flex-1 flex-col items-start overflow-hidden rounded-[6px] border"
      style={{ borderColor: HAIRLINE, backgroundImage: PANEL_GRADIENT }}
    >
      {/* Snippets sit top-aligned; on the shorter (Inngest) column the
          panel grows to match its taller sibling, leaving gradient
          showing below. */}
      <div className="flex w-full flex-col gap-4">{children}</div>
    </div>
  );
}

// ---- column header -------------------------------------------------

function ColumnHeader({
  label,
  logomark,
  body,
  align,
}: {
  label: string;
  logomark?: boolean;
  body: string;
  align: "left" | "right";
}) {
  const right = align === "right";
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-8",
        right ? "items-end" : "items-start",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-2 font-v1Display text-v1-heading-sm uppercase text-v1-frost",
          right && "flex-row justify-end",
        )}
      >
        {logomark && <Logo logomarkOnly width={26} />}
        {label}
      </span>
      <p
        className={cn(
          "text-v1-body-sm text-v1-frost",
          right ? "text-right" : "text-left",
        )}
      >
        {body}
      </p>
    </div>
  );
}

// ---- section -------------------------------------------------------

export default function CodeComparison() {
  return (
    <Section
      aria-labelledby="ct-code-heading"
      className="relative"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="ct-code-heading"
        // Title widened to the two-line wrap shown in the design.
        titleClassName="lg:max-w-[868px]"
        title={<>Eliminating Temporal&apos;s infrastructure tax.</>}
        titleAside={<DocsCtaPair />}
      />

      {/* Two 2px-bordered column boxes, flush at lg (the right column's
          left border overlaps the left column's right border via the
          -2px offset so the shared seam reads as a single 2px stroke). */}
      <div className={`${V1_HEADER_CONTENT_MT} flex flex-col lg:flex-row lg:items-stretch`}>
        {/* Temporal */}
        <motion.div
          {...reveals.item(0)}
          className="flex flex-col gap-8 border-2 border-v1-frost p-6 sm:p-8 lg:flex-1"
        >
          <ColumnHeader
            align="left"
            label="Temporal"
            body="Temporal requires workers as a deployment unit. Temporal puts a server, a database, and worker processes in your cloud before you write a line of business logic."
          />
          <CodePanel>
            <Snippet first label="activities.ts" code={ACTIVITIES_TS} />
            <Snippet label="workflow.ts" code={WORKFLOW_TS} />
            <Snippet label="worker.ts" code={WORKER_TS} />
          </CodePanel>
        </motion.div>

        {/* Inngest */}
        <motion.div
          {...reveals.item(1)}
          className="-mt-0.5 flex flex-col gap-8 border-2 border-v1-frost p-6 sm:p-8 lg:-ml-0.5 lg:mt-0 lg:flex-1"
        >
          <ColumnHeader
            align="right"
            logomark
            label="Inngest"
            body="Inngest calls your existing HTTP endpoints – no new infrastructure, no separate deployment pipeline."
          />
          <CodePanel>
            <Snippet first label="workflows.ts" code={WORKFLOWS_TS} />
            <Snippet label="server.ts" code={SERVER_TS} />
          </CodePanel>
        </motion.div>
      </div>
    </Section>
  );
}
