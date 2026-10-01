package human_in_the_loop

import (
	"context"
	"errors"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func threeOutcomes(ctx context.Context) (any, error) {
	// !snippet:start
	approval, err := step.WaitForEvent[inngestgo.GenericEvent[ApprovalResponse]](ctx, "wait-for-approval", step.WaitForEventOpts{
		Event:   "agent/approval.response",
		If:      inngestgo.StrPtr("async.data.approvalId == event.data.approvalId"),
		Timeout: 24 * time.Hour,
	})

	if errors.Is(err, step.ErrEventNotReceived) {
		// TIMEOUT: No response within the window
		return map[string]any{"status": "timed_out"}, nil
	}
	if err != nil {
		return nil, err
	}

	if approval.Data.Approved {
		// APPROVED: Proceed with the action
		result, err := step.Run(ctx, "execute-action", func(ctx context.Context) (any, error) {
			return performAction(ctx, approval.Data)
		})
		if err != nil {
			return nil, err
		}
		return map[string]any{"status": "approved", "result": result}, nil
	}

	// REJECTED
	return map[string]any{"status": "rejected", "reason": approval.Data.Reason}, nil
	// !snippet:end
}
