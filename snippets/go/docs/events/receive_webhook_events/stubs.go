package receive_webhook_events

import "context"

type Email struct {
	To      string
	From    string
	Subject string
	HTML    string
}

type emailClient struct{}

func (emailClient) Send(ctx context.Context, e Email) (any, error) { return nil, nil }

var emails emailClient

func welcomeEmailHTML() string { return "" }

var stripeSecret = "whsec_..."

func verifySig(raw, sig, secret string) bool { return raw != "" && sig != "" && secret != "" }
