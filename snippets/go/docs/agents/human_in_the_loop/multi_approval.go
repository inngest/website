package human_in_the_loop

// !snippet:start
import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type PublishRequested struct {
	ContentID string `json:"contentId"`
}

type ReviewCompleted struct {
	ContentID string `json:"contentId"`
	Approved  bool   `json:"approved"`
}

func MultiApprovalWorkflow(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "multi-approval-publish"},
		inngestgo.EventTrigger("content/publish.requested", nil),
		func(ctx context.Context, input inngestgo.Input[PublishRequested]) (any, error) {
			contentID := input.Event.Data.ContentID

			content, err := step.Run(ctx, "generate-content", func(ctx context.Context) (Content, error) {
				return generateContent(ctx, contentID)
			})
			if err != nil {
				return nil, err
			}

			// --- Gate 1: Editorial approval ---
			_, err = step.Run(ctx, "request-editorial-review", func(ctx context.Context) (any, error) {
				return nil, sendSlackMessage(ctx, SlackMessage{
					Channel: "#editorial",
					Text:    fmt.Sprintf("📝 Review needed: %s\n\n%s", content.Title, content.Preview),
				})
			})
			if err != nil {
				return nil, err
			}

			editorialApproval, err := step.WaitForEvent[inngestgo.GenericEvent[ReviewCompleted]](ctx, "wait-editorial", step.WaitForEventOpts{
				Event:   "content/review.completed",
				If:      inngestgo.StrPtr("async.data.contentId == event.data.contentId"),
				Timeout: 48 * time.Hour,
			})
			if err != nil && !errors.Is(err, step.ErrEventNotReceived) {
				return nil, err
			}

			if !editorialApproval.Data.Approved {
				return map[string]any{"status": "rejected_by_editorial"}, nil
			}

			// --- Gate 2: Legal approval ---
			_, err = step.Run(ctx, "request-legal-review", func(ctx context.Context) (any, error) {
				return nil, sendSlackMessage(ctx, SlackMessage{
					Channel: "#legal-review",
					Text:    fmt.Sprintf("⚖️ Legal review needed: %s\n\nEditorial approved. Awaiting legal sign-off.", content.Title),
				})
			})
			if err != nil {
				return nil, err
			}

			legalApproval, err := step.WaitForEvent[inngestgo.GenericEvent[ReviewCompleted]](ctx, "wait-legal", step.WaitForEventOpts{
				Event:   "content/legal-review.completed",
				If:      inngestgo.StrPtr("async.data.contentId == event.data.contentId"),
				Timeout: 72 * time.Hour,
			})
			if err != nil && !errors.Is(err, step.ErrEventNotReceived) {
				return nil, err
			}

			if !legalApproval.Data.Approved {
				return map[string]any{"status": "rejected_by_legal"}, nil
			}

			// --- Both gates passed ---
			_, err = step.Run(ctx, "publish", func(ctx context.Context) (any, error) {
				return nil, publishContent(ctx, content)
			})
			if err != nil {
				return nil, err
			}

			return map[string]any{"status": "published", "approvals": []string{"editorial", "legal"}}, nil
		},
	)
}

// !snippet:end
