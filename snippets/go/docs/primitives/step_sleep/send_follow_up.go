package step_sleep

// !snippet:start
import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type UserSignedUp struct {
	Email string `json:"email"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "send-follow-up"},
		inngestgo.EventTrigger("app/user.signed-up", nil),
		func(ctx context.Context, input inngestgo.Input[UserSignedUp]) (any, error) {
			step.Sleep(ctx, "wait-before-follow-up", 30*time.Minute)

			return step.Run(ctx, "send-follow-up", func(ctx context.Context) (any, error) {
				return nil, sendFollowUpEmail(ctx, input.Event.Data.Email)
			})
		},
	)
	if err != nil {
		panic(err)
	}
}

// !snippet:end
