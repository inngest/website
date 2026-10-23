import { Inngest } from "inngest";
import {
  checkInsOn,
  easternDate,
  recordCheckIn,
} from "@/utils/twelveDays/store";

/**
 * Inngest functions for the 12 Days of Workflows check-ins, served from
 * /api/inngest.
 *
 * Its own app id rather than "website": the website's other clients only
 * send events, and serving under that id could clash with whatever
 * already handles them.
 */
export const inngest = new Inngest({
  id: "website-campaigns",
  eventKey: process.env.NEXT_PUBLIC_INNGEST_KEY,
});

export const LESSON_COMPLETED = "website/12-days.lesson.completed";
export const MILESTONE_REACHED = "website/12-days.milestone.reached";

export interface LessonCompletedData {
  /** `{userId}:{day}`: one check-in per person per lesson. */
  checkInId: string;
  userId: string;
  email: string;
  day: number;
}

/** Lesson counts that unlock a reward (see PRIZES on the page). */
const MILESTONES = [9, 12];

/**
 * Records a completed lesson. Retries and double clicks are safe: the
 * function is idempotent per check-in, and the store ignores a lesson
 * the user already has. Crossing 9 or 12 lessons emits a milestone event
 * for the merch and raffle follow-up (nothing consumes it yet).
 */
export const recordLessonCompleted = inngest.createFunction(
  {
    id: "12-days-record-lesson-completed",
    name: "12 Days: record lesson check-in",
    triggers: { event: LESSON_COMPLETED },
    idempotency: "event.data.checkInId",
  },
  async ({ event, step }) => {
    const data = event.data as LessonCompletedData;

    const result = await step.run("record-check-in", () =>
      recordCheckIn({
        userId: data.userId,
        email: data.email,
        day: data.day,
        at: new Date(event.ts ?? Date.now()),
      })
    );

    if (result.isNew && MILESTONES.includes(result.total)) {
      await step.sendEvent("milestone-reached", {
        name: MILESTONE_REACHED,
        data: {
          userId: data.userId,
          email: data.email,
          lessons: result.total,
        },
      });
    }

    return result;
  }
);

/** Slack shows the list inline up to here, then points at the CSV. */
const SLACK_ROW_LIMIT = 50;

/**
 * Just after midnight Eastern, posts the previous day's check-ins to
 * Slack. Runs through December and January, since people can catch up
 * on earlier lessons after the last door opens; a day with no
 * check-ins posts nothing.
 */
export const postDailyCheckIns = inngest.createFunction(
  {
    id: "12-days-post-daily-check-ins",
    name: "12 Days: post daily check-ins to Slack",
    triggers: { cron: "TZ=America/New_York 5 0 * 12,1 *" },
  },
  async ({ step }) => {
    const date = await step.run("pick-date", () =>
      // Five past midnight, so an hour back is safely yesterday.
      easternDate(new Date(Date.now() - 60 * 60 * 1000))
    );

    const rows = await step.run("collect-check-ins", () => checkInsOn(date));
    if (rows.length === 0) return { date, posted: false };

    await step.run("post-to-slack", async () => {
      const webhook = process.env.TWELVE_DAYS_SLACK_WEBHOOK_URL;
      if (!webhook) throw new Error("TWELVE_DAYS_SLACK_WEBHOOK_URL is not set");

      const people = new Set(rows.map((r) => r.userId)).size;
      const lines = rows
        .slice(0, SLACK_ROW_LIMIT)
        .map(
          (r) => `• ${r.email || r.userId}: lesson ${r.day} (${r.total}/12)`
        );
      const more =
        rows.length > SLACK_ROW_LIMIT
          ? `\n…and ${rows.length - SLACK_ROW_LIMIT} more.`
          : "";

      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text:
            `*12 Days of Workflows check-ins for ${date}*: ` +
            `${rows.length} lesson${rows.length === 1 ? "" : "s"} from ` +
            `${people} ${people === 1 ? "person" : "people"}.\n` +
            `${lines.join("\n")}${more}\n` +
            `Full CSV: /api/12-days/export?date=${date} (bearer token).`,
        }),
      });
      if (!res.ok) throw new Error(`Slack webhook failed: ${res.status}`);
    });

    return { date, posted: true, count: rows.length };
  }
);

export const twelveDaysFunctions = [recordLessonCompleted, postDailyCheckIns];
