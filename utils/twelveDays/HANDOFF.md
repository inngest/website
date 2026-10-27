# 12 Days of Workflows: check-in endpoint (app team spec)

The 12 Days of Workflows calendar at `inngest.com/12-days-of-workflows` records which lessons each Inngest user completes. The app already knows who is signed in, so the website sends check-ins straight to the app. This page is what the app has to build. The website side is done.

## The flow

1. Someone clicks **Mark done** on a lesson. The page calls the app's endpoint with the user's app login cookie attached (`fetch(..., { credentials: "include" })`). inngest.com and app.inngest.com are the same site, so the browser sends the cookie.
2. **Signed in:** the app sends one Inngest event per lesson and answers `201`.
3. **Signed out:** the app answers `401`. The lesson shows **Sign in to count it**, which goes to:

   ```
   https://app.inngest.com/sign-in
     ?redirect_url=https://www.inngest.com/12-days-of-workflows?checkin=1&door=5#day-5
     &ref=12-days-of-workflows
   ```

   (`redirect_url` is URL-encoded in the real link.) After sign-in the app sends them back to `redirect_url`. The page resends every lesson finished in that browser, which now gets `201`.

Recording, the daily Slack list, the CSV export and the Segment calls (which reach Customer.io and Attio for the reminder emails) run in the website's Inngest functions (`utils/twelveDays/functions.ts`), triggered by the app's event.

## 1. The endpoint

`POST https://app.inngest.com/api/12-days/check-in`. The website calls `${NEXT_PUBLIC_APP_HOST}/api/12-days/check-in` by default; tell us if the path should differ.

Request body:

```json
{ "days": [1, 2, 5] }
```

`days` is every lesson to check in, often several at once when the page syncs after sign-in. Resends are normal and harmless.

| Case                                                     | Response                                                  |
| -------------------------------------------------------- | --------------------------------------------------------- |
| No valid app session                                     | `401`                                                     |
| `days` missing, empty, or has anything but integers 1–12 | `400`                                                     |
| Otherwise                                                | Send the events, then `201` with `{ "checkedIn": [...] }` |

Check the session **before** validating `days`, so a signed-out visitor always gets `401`. The page treats `401` as "offer sign-in" and anything else that isn't `2xx` as "couldn't save, retry".

There's no need to check whether a lesson's door is open. The website's function does that, using the unlock times in `components/v1/sections/TwelveDays/data.ts`.

## 2. The event

One event per day, sent from the app's server:

```ts
await inngest.send(
  days.map((day) => ({
    // Same id for the same person and lesson, so resends collapse.
    id: `12dow-${user.id}:${day}`,
    name: "app/12-days.lesson.completed",
    data: { userId: user.id, email: user.email, day },
  }))
);
```

- `userId`: the stable Inngest account user id, not the email.
- `email`: the user's primary email.
- Send it to the **same Inngest environment** as the website's `NEXT_PUBLIC_INNGEST_KEY` (production), where the `website-campaigns` app is synced.

## 3. CORS

The call comes from another origin, carries a cookie, and has a JSON body, so the browser sends a preflight `OPTIONS` request first. Both the preflight and the real response, **including the `401`**, need:

```
Access-Control-Allow-Origin: https://www.inngest.com   (echo the request's Origin if it's allowed; never "*")
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Vary: Origin
```

Allowed origins: `https://www.inngest.com`, `https://inngest.com`, and `http://localhost:3001` in development only. Without these headers on the `401`, the page can't read it and shows "Couldn't save" instead of the sign-in prompt.

**The app's login has to travel as a cookie** on this request, sent for `SameSite=Lax` or `None` same-site requests. If the app's session lives somewhere the browser won't send automatically, tell us and we'll switch to a redirect: **Mark done** would send people to an app page that records the check-in and redirects straight back.

Vercel preview hosts (`*.vercel.app`) are a different site, so the cookie isn't sent from them. Test against production or a local website pointed at a local or staging app (below).

## 4. Sign-in return trip

- Read the return address from `redirect_url` (tell us if the app uses another name; it's `SIGN_IN_RETURN_PARAM` in `components/v1/sections/TwelveDays/useCheckIn.ts`).
- Keep it, and `ref`, through the whole sign-in, including the round trip to Google or GitHub and through sign-up.
- Only follow return addresses on `www.inngest.com`, `inngest.com`, and `localhost:3001` in development.
- For new accounts, save `ref=12-days-of-workflows` wherever the app keeps sign-up attribution, so campaign sign-ups show up there.

## 5. Blocking fake events

The website's Inngest event key (`NEXT_PUBLIC_INNGEST_KEY`) ships to browsers, so anyone could use it to send the campaign's events themselves, including ones that send email. In the Inngest dashboard, add a filter on that key that **denies** all of these (the list is in `utils/twelveDays/client.ts`):

- `app/12-days.lesson.completed`
- `website/12-days.check-in.recorded`
- `website/12-days.milestone.reached`
- `website/12-days.door.opened`
- `website/12-days.door.open-requested`
- `website/12-days.email.requested`
- `website/12-days.emails.paused`

Only the app's server key and the website's own functions should send them. As a second line of defense, the email sender only mails people who have checked in, at the address they checked in with.

## 6. Segment, Customer.io and Attio (for Pat)

For each check-in, the website sends Segment (server side, `utils/twelveDays/segment.ts`):

- `track` `12 Days Lesson Completed` with `email`, `lesson`, `lesson_primitive`, `lessons_completed` and `campaign: "12-days-of-workflows"`.
- `track` `12 Days Milestone Reached` with `lessons` (9 or 12), the first time someone gets there.
- `identify` with `userId` = the event's `userId`, and traits `email`, `twelve_days_joined: true` and `twelve_days_lessons_completed`. Debounced: one update after a burst of check-ins.

**`userId` must be the same id the app uses when it identifies people in Segment.** Otherwise Customer.io and Attio get a second profile for the same person. Tell us if the app identifies by something else.

On the Segment side: make sure these traits and events go on to the Customer.io and Attio destinations. In Attio, build a "12 Days of Workflows" list from `twelve_days_joined`. Customer.io can use the same trait for later sends (livestream, buildathon).

## 7. The daily emails run in Inngest (for Pat)

The "Day N is open" emails aren't scheduled in Customer.io. Inngest decides who gets what and when (`utils/twelveDays/doors.ts`); Customer.io only sends, through its transactional API, so templates, delivery and unsubscribes stay there.

1. **Midnight Eastern on each unlock weekday:** a cron finds today's door and fans out one run per participant (everyone who has checked in at least once).
2. **9 AM Eastern:** each run emails "Day N is open", unless that person already did the lesson overnight.
3. **6 PM Eastern:** if they still haven't done it, one nudge. The run waits for their check-in event, so finishing the lesson cancels the nudge.
4. All sends go through one function throttled to 50 a second, under Customer.io's transactional limit.

**Kill switch:** sending `website/12-days.emails.paused` from the Inngest dashboard cancels every waiting email and nudge. Use it if a template goes out wrong.

**To test a door before December 3**, send `website/12-days.door.open-requested` with `{ "day": 1 }`. The 9 AM and 6 PM times are still that door's real December dates, so the runs sleep until then.

What Customer.io needs:

- Two **transactional messages**, "door open" and "nudge", with "send to unsubscribed" off. Their Liquid data: `{{ trigger.day }}`, `{{ trigger.primitive }}`, `{{ trigger.gift }}` and `{{ trigger.lesson_url }}`, a link back to that lesson with a ref tag.
- People are identified by `id` = the same Inngest user id as in Segment.
- In Vercel: `CUSTOMERIO_APP_API_KEY`, `CUSTOMERIO_12DOW_DOOR_MESSAGE_ID`, `CUSTOMERIO_12DOW_NUDGE_MESSAGE_ID`, and `CUSTOMERIO_API_HOST=https://api-eu.customer.io` only for an EU workspace. Until they're set, sends are skipped and the run says why.

## Testing

Point a local website at the app with `NEXT_PUBLIC_TWELVE_DAYS_CHECK_IN_URL` (or `NEXT_PUBLIC_APP_HOST`), sign in to the app in the same browser, and mark a lesson done. Doors only count once open, so use December dates or watch the function reject early ones (`Lesson N isn't open yet`).

The endpoint by itself:

```bash
curl -i -X POST https://app.inngest.com/api/12-days/check-in \
  -H 'Origin: https://www.inngest.com' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: <your app session cookie>' \
  -d '{"days":[1]}'
```

Expect `201` with the CORS headers, and `401` (still with the CORS headers) without the cookie.
