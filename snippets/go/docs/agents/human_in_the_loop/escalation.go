package human_in_the_loop

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type EscalationTask struct {
	EscalationContact string `json:"escalationContact"`
}

func escalation(ctx context.Context, input inngestgo.Input[EscalationTask], actionSummary string) (any, error) {
	// !snippet:start
	approval, err := step.WaitForEvent[inngestgo.GenericEvent[ApprovalResponse]](ctx, "wait-for-approval", step.WaitForEventOpts{
		Event:   "agent/approval.response",
		If:      inngestgo.StrPtr("async.data.approvalId == event.data.approvalId"),
		Timeout: 4 * time.Hour,
	})

	if errors.Is(err, step.ErrEventNotReceived) {
		_, err := step.Run(ctx, "escalate-to-manager", func(ctx context.Context) (any, error) {
			return nil, sendSlackDM(
				ctx,
				input.Event.Data.EscalationContact,
				fmt.Sprintf("⚠️ Approval needed — original reviewer didn't respond in 4 hours.\n\n%s", actionSummary),
			)
		})
		if err != nil {
			return nil, err
		}

		escalatedApproval, err := step.WaitForEvent[inngestgo.GenericEvent[ApprovalResponse]](ctx, "wait-for-escalation", step.WaitForEventOpts{
			Event:   "agent/approval.response",
			If:      inngestgo.StrPtr("async.data.approvalId == event.data.approvalId"),
			Timeout: 4 * time.Hour,
		})
		if errors.Is(err, step.ErrEventNotReceived) {
			return map[string]any{"status": "timed_out", "escalated": true}, nil
		}
		if err != nil {
			return nil, err
		}

		return handleApproval(escalatedApproval)
	}
	// !snippet:end
	if err != nil {
		return nil, err
	}
	return handleApproval(approval)
}
