package dependency_injection

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type UserLoggedIn struct {
	UserID string `json:"userId"`
}

func WriteAuditLog(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "write-audit-log"},
		inngestgo.EventTrigger("app/user.logged-in", nil),
		func(ctx context.Context, input inngestgo.Input[UserLoggedIn]) (any, error) {
			db := DatabaseFromContext(ctx)
			return step.Run(ctx, "write-audit-log", func(ctx context.Context) (any, error) {
				return db.AuditLog.Create(ctx, AuditLog{
					UserID: input.Event.Data.UserID,
					Action: "logged-in",
				})
			})
		},
	)
}

// !snippet:end
