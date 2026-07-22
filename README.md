# Inngest Website

The Inngest website contains marketing, documentation, and blog content.

## Setup

Before being able to run the app for the first time, you need to follow the steps below:

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js 22](https://nodejs.org/en/download/)
- _Optional\*_ - Join the team on Vercel with your GitHub account.

### Instructions

1. Clone this repository
2. Install [`pnpm`](https://pnpm.io/) with
   [Corepack](https://nodejs.org/docs/latest-v22.x/api/corepack.html) by running
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
[http://localhost:3001](http://localhost:3001).

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

### Blog Videos (Adaptive Streaming)

Videos embedded in blog posts should be served as **HLS** (adaptive bitrate)
rather than a single large file. HLS starts playback quickly and adapts the
quality to the viewer's connection, so a slow network gets a lower-resolution
stream instead of a stalled video.

**Prerequisite:** [`ffmpeg`](https://ffmpeg.org/) (which includes `ffprobe`):

```sh
$ brew install ffmpeg
```

Transcode a source video into an HLS ladder (1080p / 720p / 480p) with:

```sh
# Writes ./hls/<name>/{master.m3u8,stream_0,stream_1,stream_2}
$ pnpm video:hls ./durable-agent-in-8-minutes.mov

# Optionally set a custom output directory
$ pnpm video:hls ./demo.mp4 ./dist/demo
```

Then:

1. Upload the **entire** output folder to the CDN, preserving its structure
   (e.g. `cdn.inngest.com/videos/<name>/`). The playlists reference segments by
   relative path, so the folder layout must be kept intact.
2. Reference the master playlist as the video `src` in your MDX:

   ```mdx
   <AutoplayVideo src="https://cdn.inngest.com/videos/<name>/master.m3u8" poster="..." />
   ```

The `AutoplayVideo` component detects `.m3u8` sources automatically: Safari/iOS
play HLS natively, and other browsers use a lazy-loaded `hls.js` shim. Non-HLS
sources (`.mp4`, `.mov`) continue to work unchanged. The source video and local
`hls/` output are build artifacts — don't commit them.

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
