/**
 * Clipboard payload for the homepage "Copy prompt to start locally" CTA.
 * Coding agents paste this into a project to stand up a first local run
 * against the Dev Server. The hero install chip copies a different string.
 */
export const LOCAL_SETUP_PROMPT = `Help me set up and complete my first successful Inngest function run in this project.

Inngest runs background functions reliably, with automatic retries and saved progress between steps. Help me get one useful example working locally and understand how it fits this project.

Target Dev Server: http://127.0.0.1:8288
Target MCP endpoint: http://127.0.0.1:8288/mcp

How to do it:

Understand this project. Inspect its language, framework, package manager, development commands, and any existing Inngest integration. Reuse working code and the running Dev Server. Briefly tell me what you plan to run and why it is a useful example for this project.
Connect to the local MCP server. First check whether Inngest MCP is already connected to the endpoint above. If nothing is listening on the Target Dev Server, start it with npx --ignore-scripts=false inngest-cli@latest dev and wait until that MCP endpoint responds. If the port is already taken, reuse that process instead of starting a second server. If MCP is missing, identify this coding client and use only its matching configuration instructions at the end of this prompt. Reuse existing MCP entries and preserve unrelated configuration. Ask for any required permission before changing client configuration. If the current session needs a restart or MCP tool reload, give the one client-specific next action, pause, and resume this task after reconnecting. Configuring a server does not make its tools available immediately. A remote editor, container, or VM needs an address that can reach this Dev Server; do not guess one. If the endpoint is up but the required tools are still missing after that reload, explain the specific fix and pause. Local Dev Server MCP needs no Cloud sign-in or credentials.
Add or complete the integration. Discover the connected server's tools and read the relevant integration guidance through its documentation tools. The Dev Server's embedded docs can lag the installed SDK; when they disagree, follow the installed SDK's types and version, and do not mix APIs from different versions. For the TypeScript SDK, set INNGEST_DEV=1 on the app process so it uses this Dev Server instead of Cloud, then restart that process. Other languages use the local-mode setting named in their current docs. Install the appropriate SDK only if needed and follow the project's conventions. Create or reuse a harmless function with a durable step and understandable output. Prefer an example related to the project without adding external services just for the demonstration. Preserve existing application behavior and avoid duplicating an integration. Ask before invoking anything with external side effects, or use an isolated safe example instead.
Connect the app. Start or reuse its development process with local dev mode already enabled. If get_apps does not list this app, sync it by sending PUT to its serve URL, for example PUT http://127.0.0.1:3000/api/inngest, using the project's real port and path. A response of Successfully registered means this Dev Server accepted the app, including when that server was started with --no-discovery. Do not assume a sync_app MCP tool exists, and do not restart a Dev Server that is already running other apps. Verify through get_apps and list_functions that this app is connected and the intended function is registered. Use the app id and function id those tools return, not an internal UUID from another API.
Run and verify the function. Call invoke_function with that app id, that function id, and a data object that matches the event payload. Keep the returned run ID. Call get_run with that exact run ID and its output included until the status is COMPLETED, and use get_run_trace when you need the step. If setup-related code fails, diagnose it, make a targeted fix, and retry, up to three repair attempts. If still blocked, report the error and next action.

Definition of done:

The app is connected and the intended function is registered.
That function's exact run is verified Completed, with its output inspected. An accepted invocation, a running or skipped run, or a different function's run is not success. Do not report completion if any required step is blocked.

After verifying success, make the final answer feel like a helpful introduction, using this order:

Lead with one clear success sentence, such as "Your first Inngest function ran successfully."
Give one sentence naming the function and summarizing its actual output in human terms. Add a "View run" link to http://127.0.0.1:8288/runs?runID= followed by the exact verified run ID. Put the ID in the link destination rather than a separate metadata row.
Under "How it works", use four short labeled bullets. Explain each concept separately in plain language using the actual names in this project; do not compress them into one paragraph:

App: what part of their project connects its background functions to Inngest.
Function: what work this function performs and what starts it.
Event: explain an event as a message that starts work. Name this function's configured event and explain its payload using the actual fields in the example. If this test used direct MCP invocation, briefly distinguish that from sending the configured event. If there is no event trigger, explain the actual trigger instead.
Step: name the work inside the durable step and explain its saved result as a checkpoint. Tie the benefit to their example: later work can retry without repeating completed steps. Say where to find the step in the run's trace. Describe reliability as a capability without claiming you demonstrated a failure or recovery unless you did. Keep each bullet to one or two simple sentences, allowing a brief extra sentence when needed to explain the event versus direct invocation accurately.

End with one short invitation to ask questions here, suggesting two or three project-specific topics such as what happens if the function fails, running it on a schedule, or other useful workflows in their app. Keep this optional and make no further code changes until asked.

Include one or two relevant documentation links alongside the concepts they explain, using URLs verified through documentation tools or pages you actually read. Omit unverified links rather than inventing them.

Keep the answer focused on the result and what the user can learn. Do not add a metadata table, repeat the run ID or status, dump raw JSON when a sentence explains the output, or list SDK versions and setup history. Mention changed files briefly only if you changed them; otherwise omit all statements about unchanged files or code. Report unresolved problems or actions the user still needs to take clearly, but omit resolved troubleshooting and routine caveats such as "retry and recovery were not tested". If verification did not succeed, report the actual blocker and next action instead of using the success format.

Use this coding client's supported format for source-file references only when they help the explanation or identify changes. For Markdown file links, use the actual existing absolute path with no extra whitespace around it: <server.js>. Replace the example path with the real file path. Do not insert spaces immediately inside the angle brackets or wrap the link in backticks. If this client does not support file links, show the project-relative filename as inline code instead.

Do not deploy to Cloud or request Cloud credentials as part of this local task.

MCP connection instructions (use only the entry for this coding client, and only if the connection is missing):

Claude Code:
claude mcp add --transport http inngest-dev http://127.0.0.1:8288/mcp

Codex CLI:
codex mcp add inngest-dev --url http://127.0.0.1:8288/mcp

Cursor:
Merge this into the project's .cursor/mcp.json, or the user-level mcp.json, preserving every other server. Reload MCP tools after saving.
{
  "mcpServers": {
    "inngest-dev": {
      "url": "http://127.0.0.1:8288/mcp"
    }
  }
}`;
