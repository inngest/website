# 12 Days of Workflows: sign-in handoff (app team spec)

The 12 Days of Workflows calendar at `inngest.com/12-days-of-workflows` records which lessons each Inngest user completes. People sign in on the app; the website needs to learn who they are when they come back. This page is what the app has to do. The website side is already built.

## The flow

1. On a lesson, a signed-out visitor clicks **Sign in to count it**. The website sends them to:

   ```
   https://app.inngest.com/sign-in
     ?redirect_url=https://www.inngest.com/12-days-of-workflows?checkin=1&door=5#day-5
     &ref=12-days-of-workflows
   ```

   (`redirect_url` is URL-encoded in the real link.)

2. They sign in or sign up however they like: Google, GitHub, email.
3. **The app** creates a sign-in pass and sends them to the `redirect_url` with `pass=<token>` added to its query string, before the `#` fragment:

   ```
   https://www.inngest.com/12-days-of-workflows?checkin=1&door=5&pass=eyJhbGciOi...#day-5
   ```

4. The page removes `pass` from the address bar and posts it to `/api/12-days/session`. The website checks it, sets its own session cookie, and records the sign-in. Check-ins work from then on.

## What the app needs to do

### 1. Accept the return address

- Read the return address from the sign-in URL. The website uses `redirect_url`; tell us if it should be something else (it's `SIGN_IN_RETURN_PARAM` in `components/v1/sections/TwelveDays/useCheckIn.ts`).
- Keep it, and `ref`, through the whole sign-in, including the round trip to Google or GitHub and through sign-up.
- Only follow return addresses on these hosts:
  - `www.inngest.com` and `inngest.com`
  - `website-git-*-inngest.vercel.app` (preview builds), if you want previews to work
  - `localhost:3001` in development only
- Only add a pass when the return path is `/12-days-of-workflows`.

### 2. Create the pass

An HS256 JWT signed with `TWELVE_DAYS_HANDOFF_SECRET`, a secret the app and the website share (set the same value in both).

| Claim         | Value                                                       |
| ------------- | ----------------------------------------------------------- |
| `iss`         | `"app.inngest.com"`                                         |
| `aud`         | `"12-days-of-workflows"`                                    |
| `sub`         | The Inngest account **user id** (stable; not the email)     |
| `email`       | The user's primary email                                    |
| `jti`         | A random id, unique per pass (UUID is fine)                 |
| `iat`         | Issued-at, seconds since the epoch                          |
| `exp`         | Expiry; at most 10 minutes after `iat`. 5 minutes suggested |
| `new_account` | `true` if this sign-in created the account, else `false`    |

The website rejects a pass with any other algorithm, a bad signature, the wrong `iss` or `aud`, an `exp` more than 10 minutes after `iat`, or one that has expired (60 seconds' clock drift is allowed). Each `jti` works once.

Example in Node:

```ts
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";

const pass = jwt.sign(
  { email: user.email, new_account: isNewAccount },
  process.env.TWELVE_DAYS_HANDOFF_SECRET,
  {
    algorithm: "HS256",
    issuer: "app.inngest.com",
    audience: "12-days-of-workflows",
    subject: user.id,
    jwtid: randomUUID(),
    expiresIn: "5m",
  }
);
```

### 3. Keep the `ref` for sign-up attribution

The sign-in link carries `ref=12-days-of-workflows`. For a new account, save it wherever the app keeps sign-up attribution today, so campaign sign-ups show up there too. The website also sends its own `website/12-days.signed-in` event (below), so this is about the app's own reporting.

## What the website does with it

- `POST /api/12-days/session` checks the pass (`utils/twelveDays/pass.ts`) and marks its `jti` used in Redis.
- It sets an httpOnly `12dow_session` cookie on `/api/12-days`, signed with a website-only secret and valid for 45 days (`utils/twelveDays/session.ts`). The check-in route reads it (`utils/twelveDays/identity.ts`).
- It sends `website/12-days.signed-in` with `userId`, `email`, `newAccount`, `ref` and `anonymousId`. `anonymousId` is the website's `inngest_anonymous_id` cookie, which joins the account to its earlier anonymous visits.

## Secrets

| Variable                     | Where               | Used for                                       |
| ---------------------------- | ------------------- | ---------------------------------------------- |
| `TWELVE_DAYS_HANDOFF_SECRET` | App **and** website | Signing and checking the sign-in pass          |
| `TWELVE_DAYS_EVENT_SECRET`   | Website only        | Signing check-in events and the session cookie |

Generate the shared one with `openssl rand -hex 32` and share it through the password manager, not Slack.

## Testing before the app is ready

With `TWELVE_DAYS_HANDOFF_SECRET` and `TWELVE_DAYS_EVENT_SECRET` set locally, make a pass and open the page with it:

```bash
node -e '
const c = require("crypto"), now = Math.floor(Date.now() / 1000);
const b = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const h = b({ alg: "HS256", typ: "JWT" });
const p = b({ iss: "app.inngest.com", aud: "12-days-of-workflows", sub: "user_test", email: "you@inngest.com", jti: c.randomUUID(), iat: now, exp: now + 300, new_account: false });
const s = c.createHmac("sha256", process.env.TWELVE_DAYS_HANDOFF_SECRET).update(h + "." + p).digest("base64url");
console.log("http://localhost:3001/12-days-of-workflows?checkin=1&door=1&pass=" + h + "." + p + "." + s + "#day-1");
'
```
