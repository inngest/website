# Inngest Website

The Inngest website contains marketing, documentation, and blog content.

## Setup

Before being able to run the app for the first time, you need to follow the steps below:

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js 18](https://nodejs.org/en/download/)
- _Optional\*_ - Join the team on Vercel with your GitHub account.

### Instructions

1. Clone this repository
2. Install [`pnpm`](https://pnpm.io/) with
   [Corepack](https://nodejs.org/docs/latest-v18.x/api/corepack.html) by running
   `corepack enable; corepack prepare`
3. Install dependencies by running `pnpm install`
4. _Optional\*_ - Link local project to its Vercel project by running `pnpm vercel link`
5. _Optional\*_ - Download environment variables by running `pnpm env:pull`

\* Running the website is possible with the default environment variables available in `.env.development`. Fetching other environment variables is only necessary if working on features that require them.

## Developing

### Running the App

#### Development Mode

To start the app in development mode, run the following command:

```sh
$ pnpm dev
```

This will start a local server that will automatically rebuild the app and refresh the page when you
make changes to the code. The app will be available at
[http://localhost:3000](http://localhost:3000).

This is how you will run the app most of the time.

#### Production Mode

To run the app in production mode, run the following commands in order:

```sh
# Build the app for production usage
$ pnpm build

# Start the app in production mode
$ pnpm start
```

This can be useful for testing the app in production mode locally.

### Environment Variables

Environment variables are managed with the [Vercel CLI](https://vercel.com/docs/cli/env). Use the
following commands to manage them:

```sh
# Download the latest development environment variables
$ pnpm env:pull

# Add a new environment variable
$ pnpm env:add

# Remove an environment variable
$ pnpm env:rm
```

Check the [Vercel documentation](https://vercel.com/docs/concepts/projects/environment-variables)
for more information.

You should **never commit environment variables** to the repository. If you need to add a new
environment variable, add it with the `pnpm env:add` command and then download it with the
`pnpm env:pull` command.
