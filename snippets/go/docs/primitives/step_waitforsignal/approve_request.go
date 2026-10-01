package step_waitforsignal

// !snippet:start
import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ApprovalRequested struct {
	RequestID string `json:"requestId"`
}

type Approval struct {
	Approved bool `json:"approved"`
}

func ApproveRequest(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "approve-request"},
		inngestgo.EventTrigger("app/approval.requested", nil),
		func(ctx context.Context, input inngestgo.Input[ApprovalRequested]) (any, error) {
			signal := fmt.Sprintf("approval/%s", input.Event.Data.RequestID)

			approval, err := step.WaitForSignal[Approval](ctx, "wait-for-approval", step.WaitForSignalOpts{
				Signal:     signal,
				Timeout:    3 * 24 * time.Hour,
				OnConflict: step.SignalConflictFail,
			})
			if errors.Is(err, step.ErrSignalNotReceived) {
				return map[string]string{"status": "timed-out"}, nil
			}
			if err != nil {
				return nil, err
			}
			if !approval.Data.Approved {
				return map[string]string{"status": "rejected"}, nil
			}

			return map[string]string{"status": "approved"}, nil
		},
	)
}

// !snippet:end
