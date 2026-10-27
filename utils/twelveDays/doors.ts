import { NonRetriableError } from "inngest";
import { DAYS, REF, unlockAt } from "@/components/v1/sections/TwelveDays/data";
import {
  DOOR_OPENED,
  EMAIL_REQUESTED,
  EMAILS_PAUSED,
  inngest,
  LESSON_COMPLETED,
  OPEN_DOOR_REQUESTED,
  type EmailRequestedData,
  type LessonCompletedData,
} from "@/utils/twelveDays/client";
import { sendTransactional } from "@/utils/twelveDays/customerio";
import {
  hasCompleted,
  participantEmail,
  participants,
} from "@/utils/twelveDays/store";

/**
 * How the doors open: the campaign running on the primitives it teaches.
 *
 * 1. At midnight Eastern a cron finds today's door and fans out one
 *    `door.opened` event per participant.
 * 2. Each participant's run sleeps until 9 AM, emails "Day N is open"
 *    unless they've already done it, then waits for them to finish the
 *    lesson. Not done by 6 PM: one nudge.
 * 3. Every email goes through one sender, throttled under Customer.io's
 *    rate limit.
 *
 * `emails.paused` cancels every waiting run and queued email.
 */

/** Eastern hours (on the door's day) for the email and the nudge. */
const EMAIL_HOUR = 9;
const NUDGE_HOUR = 18;
/** Events per sendEvent call in the fan-out. */
const FAN_OUT_CHUNK = 500;

/** `hour` o'clock Eastern on the day door `day` opens. */
function onDoorDay(day: number, hour: number): Date {
  return new Date(unlockAt(day).getTime() + hour * 60 * 60 * 1000);
}

/** The door opening at `now` (give or take an hour), if any. */
export function doorFor(now: Date): number | null {
  const door = DAYS.find(
    (d) => Math.abs(unlockAt(d.day).getTime() - now.getTime()) < 60 * 60 * 1000
  );
  return door?.day ?? null;
}

const isDay = (day: unknown): day is number =>
  Number.isInteger(day) &&
  (day as number) >= 1 &&
  (day as number) <= DAYS.length;

/**
 * The page's "How the doors open" cron, for real. Also runs on
 * `door.open-requested` (`{ day }`), to test or rerun a door.
 */
export const openTodaysDoor = inngest.createFunction(
  {
    id: "12-days-open-todays-door",
    name: "12 Days: open today's door",
    triggers: [
      // Midnight Eastern, every weekday in December.
      { cron: "TZ=America/New_York 0 0 * 12 1-5" },
      { event: OPEN_DOOR_REQUESTED },
    ],
  },
  async ({ event, step }) => {
    const day = await step.run("which-door", () => {
      if (event.name !== OPEN_DOOR_REQUESTED) return doorFor(new Date());
      const requested = (event.data as { day?: unknown }).day;
      if (!isDay(requested)) {
        throw new NonRetriableError("door.open-requested needs a day, 1–12");
      }
      return requested;
    });
    if (!day) return { day: null }; // Outside December 3–18.

    const people = await step.run("list-participants", () => participants());

    // Fan-out: one run per person, so one slow or failing email never
    // holds up anyone else's. Stable ids make a rerun harmless.
    for (let i = 0; i < people.length; i += FAN_OUT_CHUNK) {
      await step.sendEvent(
        `fan-out-${i / FAN_OUT_CHUNK}`,
        people.slice(i, i + FAN_OUT_CHUNK).map((p) => ({
          id: `12dow-door-${day}-${p.userId}`,
          name: DOOR_OPENED,
          data: { ...p, day },
        }))
      );
    }

    return { day, participants: people.length };
  }
);

/**
 * One participant's door day: wait for the morning, email them, wait
 * for them to do the lesson, nudge once in the evening if they haven't.
 */
export const doorJourney = inngest.createFunction(
  {
    id: "12-days-door-journey",
    name: "12 Days: door email and nudge",
    triggers: { event: DOOR_OPENED },
    cancelOn: [{ event: EMAILS_PAUSED }],
  },
  async ({ event, step }) => {
    const { userId, email, day } = event.data as LessonCompletedData;
    const request = (kind: EmailRequestedData["kind"]) => ({
      id: `12dow-email-${kind}-${userId}-${day}`,
      name: EMAIL_REQUESTED,
      data: { userId, email, day, kind } satisfies EmailRequestedData,
    });

    // Doors open at midnight; nobody wants that email at midnight.
    await step.sleepUntil("wait-for-morning", onDoorDay(day, EMAIL_HOUR));

    // Night owls may have done it already.
    if (await step.run("done-overnight", () => hasCompleted(userId, day))) {
      return { emailed: false, reason: "already done" };
    }
    await step.sendEvent("email-door-open", request("door"));

    // Waits for this person to finish this lesson, until the evening.
    const finished = await step.waitForEvent("wait-for-lesson", {
      event: LESSON_COMPLETED,
      if: "async.data.userId == event.data.userId && async.data.day == event.data.day",
      timeout: onDoorDay(day, NUDGE_HOUR),
    });
    if (finished) return { emailed: true, nudged: false };

    // A check-in just before the wait started wouldn't be seen by it.
    if (await step.run("done-before-nudge", () => hasCompleted(userId, day))) {
      return { emailed: true, nudged: false };
    }
    await step.sendEvent("email-nudge", request("nudge"));
    return { emailed: true, nudged: true };
  }
);

/**
 * The only place campaign email leaves from. Throttled under
 * Customer.io's transactional limit (100 requests a second), so a
 * fan-out to everyone at 9 AM queues up instead of bouncing; queued
 * sends are cancelled by the kill switch too.
 */
export const sendCampaignEmail = inngest.createFunction(
  {
    id: "12-days-send-email",
    name: "12 Days: send email",
    triggers: { event: EMAIL_REQUESTED },
    throttle: { limit: 50, period: "1s" },
    cancelOn: [{ event: EMAILS_PAUSED }],
  },
  async ({ event, step }) => {
    const { userId, email, day, kind } = event.data as EmailRequestedData;
    if (!isDay(day) || (kind !== "door" && kind !== "nudge")) {
      throw new NonRetriableError("Invalid email request");
    }

    // Only ever mail someone who checked in with this address.
    const known = await step.run("check-recipient", () =>
      participantEmail(userId)
    );
    if (known !== email) {
      throw new NonRetriableError("Not a 12 Days participant");
    }

    const lesson = DAYS.find((d) => d.day === day);
    return step.run("send", () =>
      sendTransactional({
        kind,
        to: email,
        userId,
        data: {
          day,
          primitive: lesson?.primitive,
          gift: lesson?.gift,
          lesson_url: `https://www.inngest.com/12-days-of-workflows?ref=${REF}-email-${kind}-day-${day}#day-${day}`,
        },
      })
    );
  }
);

export const doorFunctions = [openTodaysDoor, doorJourney, sendCampaignEmail];
