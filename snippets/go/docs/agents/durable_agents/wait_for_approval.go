package durable_agents

import (
	"context"
	"errors"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ApprovalResponse struct {
	ApprovalID string `json:"approvalId"`
	Approved   bool   `json:"approved"`
}

func waitForApproval(ctx context.Context) (any, error) {
	// !snippet:start
	approval, err := step.WaitForEvent[inngestgo.GenericEvent[ApprovalResponse]](
		ctx,
		"wait-for-approval",
		step.WaitForEventOpts{
			Event:   "agent/approval.response",
			If:      inngestgo.StrPtr("async.data.approvalId == event.data.approvalId"),
			Timeout: 24 * time.Hour,
		},
	)
	if errors.Is(err, step.ErrEventNotReceived) {
		return map[string]any{"status": "timed_out"}, nil
	}
	if err != nil {
		return nil, err
	}

	if !approval.Data.Approved {
		return map[string]any{"status": "rejected"}, nil
	}
	// !snippet:end
	return nil, nil
}
