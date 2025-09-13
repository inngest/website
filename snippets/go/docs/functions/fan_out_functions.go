package functions

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

// !snippet:start
func loadSendWelcomeEmailInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "send-welcome-email",
		},
		inngestgo.EventTrigger("app/user.signup", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			_, err := step.Run(ctx, "send-email", func(ctx context.Context) (any, error) {
				return SendEmail(SendEmailInput{
					To:      input.Event.Data["user"].(map[string]interface{})["email"].(string),
					Subject: "welcome",
				})
			})
			return nil, err
		},
	)
}

func loadStartStripeTrialInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "start-stripe-trial",
		},
		inngestgo.EventTrigger("app/user.signup", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			customerID, err := step.Run(ctx, "create-customer", func(ctx context.Context) (any, error) {
				return CreateStripeAccount(&StripeCustomerParams{
					Email: input.Event.Data["user"].(map[string]interface{})["email"].(string),
				})
			})
			if err != nil {
				return nil, err
			}
			_, err = step.Run(ctx, "create-subscription", func(ctx context.Context) (any, error) {
				return CreateStripeSubscription(&StripeSubscriptionParams{
					Customer:        customerID.(string),
					TrialPeriodDays: 14,
				})
			})
			return nil, err
		},
	)
}

// !snippet:end

type StripeCustomerParams struct {
	Email string
}

type StripeSubscriptionParams struct {
	Customer        string
	TrialPeriodDays int
}

func CreateStripeAccount(params *StripeCustomerParams) (any, error) {
	panic("unimplemented")
}

func CreateStripeSubscription(params *StripeSubscriptionParams) (any, error) {
	panic("unimplemented")
}
