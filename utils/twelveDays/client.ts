import { Inngest } from "inngest";

/**
 * The Inngest client and events for the 12 Days of Workflows campaign.
 * Functions live in functions.ts (check-ins, Slack, Segment) and
 * doors.ts (the unlock cron and emails), served from /api/inngest.
 *
 * Its own app id rather than "website": the website's other clients only
 * send events, and serving under that id could clash with whatever
 * already handles them.
 *
 * The website's event key is public (it ships to browsers), so it needs
 * a filter in Inngest denying every event name below; otherwise anyone
 * could send them. Only the app and these functions should.
 */
export const inngest = new Inngest({
  id: "website-campaigns",
  eventKey: process.env.NEXT_PUBLIC_INNGEST_KEY,
});

/**
 * Sent by app.inngest.com's check-in endpoint, which knows who is
 * signed in (see HANDOFF.md).
 */
export const LESSON_COMPLETED = "app/12-days.lesson.completed";
/** A check-in is saved; the Segment profile catches up (debounced). */
export const CHECK_IN_RECORDED = "website/12-days.check-in.recorded";
/** Someone reached 9 or 12 lessons for the first time. */
export const MILESTONE_REACHED = "website/12-days.milestone.reached";
/** Today's door opened for one participant (the unlock cron's fan-out). */
export const DOOR_OPENED = "website/12-days.door.opened";
/** Opens a door now, for testing or a rerun: `{ day }`. */
export const OPEN_DOOR_REQUESTED = "website/12-days.door.open-requested";
/** One campaign email to send, through the throttled sender. */
export const EMAIL_REQUESTED = "website/12-days.email.requested";
/**
 * The kill switch: cancels every waiting email and nudge, e.g. after
 * spotting a mistake in a template. Send it from the Inngest dashboard.
 */
export const EMAILS_PAUSED = "website/12-days.emails.paused";

export interface Participant {
  /** Inngest account user id. */
  userId: string;
  email: string;
}

export interface LessonCompletedData extends Participant {
  day: number;
}

export type EmailKind = "door" | "nudge";

export interface EmailRequestedData extends Participant {
  day: number;
  kind: EmailKind;
}
