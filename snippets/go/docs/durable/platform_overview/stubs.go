package platform_overview

import "context"

type TicketContext struct {
	History []string `json:"history"`
}

func loadTicketContext(ctx context.Context, ticketID string) (TicketContext, error) {
	return TicketContext{}, nil
}

func draftAnswer(ctx context.Context, tc TicketContext) (string, error) {
	return "...", nil
}

func sendReply(ctx context.Context, ticketID, answer string) error {
	return nil
}
