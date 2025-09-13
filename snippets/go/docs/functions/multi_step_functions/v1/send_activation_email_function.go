package multistepfunctions_v1

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendActivationEmailInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "activation-email",
		},
		inngestgo.EventTrigger("app/user.created", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			if err := sendEmail(input.Event.Data["user"].(map[string]interface{})["email"].(string), "welcome"); err != nil {
				return nil, err
			}
			return nil, nil
		},
	)
}

// !snippet:end

func sendEmail(email any, msg any) error {
	return nil
}
