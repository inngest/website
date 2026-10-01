package sub_agent_delegation

import (
	"context"
	"fmt"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

const REPORT_WEBHOOK_URL = "https://example.com/reports"

func scheduleSubAgent(ctx context.Context, tomorrow9am time.Time) error {
	// !snippet:start
	_, err := step.Send(ctx, "schedule-daily-report", inngestgo.Event{
		Name: "agent/sub-agent.spawn",
		Data: map[string]any{
			"task":      "Generate the daily analytics summary report.",
			"sessionId": fmt.Sprintf("scheduled-%d", time.Now().UnixMilli()),
			"isAsync":   true,
			"replyTo":   map[string]any{"type": "webhook", "url": REPORT_WEBHOOK_URL},
		},
		Timestamp: tomorrow9am.UnixMilli(),
	})
	// !snippet:end
	return err
}
