package fan_out

import "context"

type User struct {
	ID    string
	Email string
}

func sendWelcomeEmail(ctx context.Context, email string) error { return nil }
func createTrial(ctx context.Context, userID string) error     { return nil }
