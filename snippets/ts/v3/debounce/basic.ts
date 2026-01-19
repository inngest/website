import { Inngest } from "inngest";

const inngest = new Inngest({ id: "my-app" });

// !snippet:start
inngest.createFunction(
  {
    id: "handle-webhook",
    debounce: {
      key: "event.data.account_id",
      period: "5m",
      timeout: "10m",
    },
  },
  { event: "intercom/company.updated" },
  async ({ event, step }) => {
    // This function will only be scheduled 5 minutes after events are no longer received with the same
    // `event.data.account_id` field.
    //
    // `event` will be the last event in the series received.
  }
);
