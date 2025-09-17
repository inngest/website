package functions

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type User struct {
	ID string
}

type Data struct {
	User User
}

func loadSendReminderInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "weekly-activity-send-email",
		},
		inngestgo.EventTrigger("app/weekly-email-activity.send", nil),
		func(ctx context.Context, input inngestgo.Input[Data]) (any, error) {
			data, err := step.Run(ctx, "load-user-data", func(ctx context.Context) (any, error) {
				return loadUserData(input.Event.Data.User.ID)
			})
			if err != nil {
				return nil, err
			}

			_, err = step.Run(ctx, "email-user", func(ctx context.Context) (any, error) {
				return SendEmail(SendEmailInput{
					To:      input.Event.Data.User.ID,
					Subject: "Welcome to Inngest!",
					Message: GenerateWelcomeEmailForUser(data),
				})
			})
			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)
}

// !snippet:end

func GenerateWelcomeEmailForUser(data any) string {
	panic("unimplemented")
}

func loadUserData(id string) (any, error) {
	return nil, nil
}
