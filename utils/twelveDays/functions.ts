import { Inngest, NonRetriableError } from "inngest";
import { DAYS, REF, unlockAt } from "@/components/v1/sections/TwelveDays/data";
import {
  segmentWriteKey,
  sendToSegment,
  type SegmentMessage,
} from "@/utils/twelveDays/segment";
import {
  checkInsOn,
  easternDate,
  lessonCount,
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

/**
 * Sent by app.inngest.com's check-in endpoint, which knows who is
 * signed in (see HANDOFF.md). The website's event key is public, so it
 * needs a filter in Inngest that blocks this name; otherwise anyone
 * could send one.
 */
export const LESSON_COMPLETED = "app/12-days.lesson.completed";
export const MILESTONE_REACHED = "website/12-days.milestone.reached";

export interface LessonCompletedData {
  /** Inngest account user id. */
  userId: string;
  email: string;
  day: number;
}

/**
 * Records a completed lesson. One run per user at a time, and the store
 * saves each check-in atomically and replays its first result on a
 * resend or retry, so catch-up batches can't lose records or double
 * up. A milestone (9 or 12 lessons) the store claims for the first time
 * emits an event for the merch and raffle follow-up (nothing consumes
 * it yet).
 *
 * Then tells Segment, which passes it on to Customer.io and Attio for
 * the reminder-email list: an identify with `twelve_days_joined` and the
 * lesson count, and a `12 Days Lesson Completed` track (plus
 * `12 Days Milestone Reached` for a new milestone).
 */
export const recordLessonCompleted = inngest.createFunction(
  {
    id: "12-days-record-lesson-completed",
    name: "12 Days: record lesson check-in",
    triggers: { event: LESSON_COMPLETED },
    concurrency: { limit: 1, key: "event.data.userId" },
  },
  async ({ event, step }) => {
    const data = event.data as LessonCompletedData;
    const at = new Date(event.ts ?? Date.now());

    if (
      typeof data.userId !== "string" ||
      !data.userId ||
      typeof data.email !== "string" ||
      !Number.isInteger(data.day) ||
      data.day < 1 ||
      data.day > DAYS.length
    ) {
      throw new NonRetriableError("Invalid check-in event");
    }
    // A door that hasn't opened can't be completed yet.
    if (unlockAt(data.day).getTime() > at.getTime()) {
      throw new NonRetriableError(`Lesson ${data.day} isn't open yet`);
    }

    const result = await step.run("record-check-in", () =>
      recordCheckIn({
        userId: data.userId,
        email: data.email,
        day: data.day,
        at,
      })
    );

    if (result.milestones.length > 0) {
      await step.sendEvent(
        "milestone-reached",
        result.milestones.map((lessons) => ({
          // Stable ids, so even a resend can't announce a milestone twice.
          id: `12dow-milestone-${data.userId}-${lessons}`,
          name: MILESTONE_REACHED,
          data: { userId: data.userId, email: data.email, lessons },
        }))
      );
    }

    const segment = await step.run("send-to-segment", async () => {
      const writeKey = segmentWriteKey();
      if (!writeKey) return "skipped: no Segment write key";

      // Read fresh, so a late resend of an early lesson can't set the
      // count back to what it was then.
      const lessons = await lessonCount(data.userId);
      const timestamp = at.toISOString();
      const lesson = DAYS.find((d) => d.day === data.day);
      const batch: SegmentMessage[] = [
        {
          type: "identify",
          userId: data.userId,
          messageId: `12dow-identify-${data.userId}-${data.day}`,
          timestamp,
          traits: {
            email: data.email,
            twelve_days_joined: true,
            twelve_days_lessons_completed: lessons,
          },
        },
        {
          type: "track",
          event: "12 Days Lesson Completed",
          userId: data.userId,
          messageId: `12dow-lesson-${data.userId}-${data.day}`,
          timestamp,
          properties: {
            email: data.email,
            lesson: data.day,
            lesson_primitive: lesson?.primitive,
            lessons_completed: lessons,
            campaign: REF,
          },
        },
        ...result.milestones.map(
          (m): SegmentMessage => ({
            type: "track",
            event: "12 Days Milestone Reached",
            userId: data.userId,
            messageId: `12dow-milestone-${data.userId}-${m}`,
            timestamp,
            properties: { email: data.email, lessons: m, campaign: REF },
          })
        ),
      ];
      await sendToSegment(writeKey, batch);
      return `sent ${batch.length}`;
    });

    return { ...result, segment };
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
