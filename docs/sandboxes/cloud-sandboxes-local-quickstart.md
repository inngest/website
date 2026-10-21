# Try Inngest Sandboxes locally

> [!NOTE]
> This is a pre-release draft. Publish it only after [inngest/inngest#4886](https://github.com/inngest/inngest/pull/4886) and [inngest/inngest-js#1728](https://github.com/inngest/inngest-js/pull/1728) are released, and after the starter repository has been updated to the compatible SDK version.

In this quickstart, you'll run an Inngest function on your computer that creates a real Sandbox in Inngest Cloud, runs JavaScript inside it, and destroys it when the function finishes.

You do not need to deploy the app or copy an event key, signing key, or Sandbox token.

## Before you start

You need:

- Node.js 20 or later;
- an Inngest account with Sandboxes beta access; and
- an existing Cloud development environment with a default VPC.

## 1. Download the example

```sh
git clone https://github.com/inngest/inngest-sandboxes-getting-started.git
cd inngest-sandboxes-getting-started
npm install
```

The example contains one Inngest function. It creates a Sandbox, runs the JavaScript sent in an event, returns the output, and destroys the Sandbox.

## 2. Log in to Inngest Cloud

```sh
npx inngest-cli@latest login
```

Your browser will open. Choose the Inngest account and a single development environment you want to use for Sandboxes.

You only need to log in once. To choose a different environment later, run:

```sh
npx inngest-cli@latest login --force
```

## 3. Start the example app

In one terminal, run:

```sh
INNGEST_DEV=1 npm run dev
```

Leave this terminal running. The app is available at [http://localhost:3000](http://localhost:3000).

## 4. Start the Inngest Dev Server

In a second terminal, from the same project directory, run:

```sh
npx inngest-cli@latest dev
```

Open [http://localhost:8288](http://localhost:8288). The Dev Server should find the example app automatically.

## 5. Run the function

1. Open **Functions** in the Dev Server.
2. Select **run-javascript-in-a-sandbox**.
3. Click **Invoke**.
4. Use this payload:

```json
{
  "data": {
    "code": "console.log('Hello from the sandbox!')"
  }
}
```

The function returns a result like this:

```json
{
  "sandboxId": "...",
  "stdout": "Hello from the sandbox!\n",
  "stderr": "",
  "exitCode": 0
}
```

Open the run to inspect each durable step: creating the Sandbox, running the command, and destroying the Sandbox.

## What just happened?

Your function, events, runs, and step state stayed in the local Dev Server. Only the Sandbox ran in Inngest Cloud. The Dev Server used the Cloud environment you selected during `inngest login` to authenticate the Sandbox requests.

The example enables `sandboxMiddleware`, which adds `step.sandbox` to Inngest functions. You can see the complete function in [`src/inngest/functions/run-javascript.ts`](https://github.com/inngest/inngest-sandboxes-getting-started/blob/main/src/inngest/functions/run-javascript.ts).

## Beta limitations

- Sandboxes are real Cloud resources and may be billable.
- Stopping the app or Dev Server does not destroy a running Sandbox. The example destroys its Sandbox as its final step, but you should clean up any Sandbox left behind by a failed or interrupted run.
- The Dev Server's **Sandboxes** page only lists Sandboxes created through this local project. Other Sandboxes remain available in the Inngest Cloud Dashboard or through the SDK.
- Cloud Sandbox access through the Dev Server is local-only. Remote development requires a local port forward.
- The current preview trusts other processes running on your computer to access the local Sandbox bridge. Use it only on a trusted machine.
- Sandboxes are an experimental beta. APIs, limits, and behavior may change.
