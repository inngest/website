package human_in_the_loop

// !snippet:start
import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type EmailDraftRequested struct {
	Recipient  string `json:"recipient"`
	Context    string `json:"context"`
	UserID     string `json:"userId"`
	ApprovalID string `json:"approvalId"`
}

type ApprovalResponseEvent = inngestgo.GenericEvent[ApprovalResponse]

func EmailApprovalWorkflow(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "email-approval-workflow"},
		inngestgo.EventTrigger("agent/email.draft-requested", nil),
		func(ctx context.Context, input inngestgo.Input[EmailDraftRequested]) (any, error) {
			data := input.Event.Data

			// Step 1: Agent drafts the email
			draft, err := step.Run(ctx, "draft-email", func(ctx context.Context) (Draft, error) {
				return generateEmail(ctx, GenerateEmailInput{
					Recipient: data.Recipient,
					Context:   data.Context,
					Tone:      "professional",
				})
			})
			if err != nil {
				return nil, err
			}

			// Step 2: Notify the human via Slack
			_, err = step.Run(ctx, "request-approval", func(ctx context.Context) (any, error) {
				approve, _ := json.Marshal(map[string]any{"approvalId": data.ApprovalID, "approved": true})
				reject, _ := json.Marshal(map[string]any{"approvalId": data.ApprovalID, "approved": false})
				return nil, sendSlackMessage(ctx, SlackMessage{
					Channel: "#agent-approvals",
					Blocks: []map[string]any{
						{
							"type": "section",
							"text": map[string]any{
								"type": "mrkdwn",
								"text": fmt.Sprintf("*Agent wants to send an email*\n\n*To:* %s\n*Subject:* %s\n\n%s", data.Recipient, draft.Subject, draft.Body),
							},
						},
						{
							"type": "actions",
							"elements": []map[string]any{
								{
									"type":      "button",
									"text":      map[string]any{"type": "plain_text", "text": "✅ Approve"},
									"action_id": "approve_email",
									"value":     string(approve),
									"style":     "primary",
								},
								{
									"type":      "button",
									"text":      map[string]any{"type": "plain_text", "text": "❌ Reject"},
									"action_id": "reject_email",
									"value":     string(reject),
									"style":     "danger",
								},
							},
						},
					},
				})
			})
			if err != nil {
				return nil, err
			}

			// Step 3: Wait for human response — no compute cost while waiting
			approval, err := step.WaitForEvent[ApprovalResponseEvent](ctx, "wait-for-approval", step.WaitForEventOpts{
				Event:   "agent/approval.response",
				If:      inngestgo.StrPtr("async.data.approvalId == event.data.approvalId"),
				Timeout: 24 * time.Hour,
			})

			// Step 4: Handle the response
			// ErrEventNotReceived means it timed out
			if errors.Is(err, step.ErrEventNotReceived) {
				_, err := step.Run(ctx, "notify-timeout", func(ctx context.Context) (any, error) {
					return nil, sendSlackMessage(ctx, SlackMessage{
						Channel: "#agent-approvals",
						Text:    fmt.Sprintf("⏰ Email approval timed out. Draft discarded.\n*To:* %s\n*Subject:* %s", data.Recipient, draft.Subject),
					})
				})
				if err != nil {
					return nil, err
				}
				return map[string]any{"status": "timed_out", "action": "email_not_sent"}, nil
			}
			if err != nil {
				return nil, err
			}

			// The event payload can be used with whatever parameters that you send
			if approval.Data.Approved {
				_, err := step.Run(ctx, "send-email", func(ctx context.Context) (any, error) {
					return nil, sendEmail(ctx, Email{
						To:      data.Recipient,
						Subject: draft.Subject,
						Body:    draft.Body,
					})
				})
				if err != nil {
					return nil, err
				}
				return map[string]any{"status": "approved", "action": "email_sent"}, nil
			}

			reason := approval.Data.Reason
			if reason == "" {
				reason = "No reason provided"
			}
			return map[string]any{
				"status": "rejected",
				"reason": reason,
				"action": "email_not_sent",
			}, nil
		},
	)
}

// !snippet:end
