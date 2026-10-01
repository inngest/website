package versioning

import "context"

type SignupData struct {
	Email string `json:"email"`
}

type Profile struct{}

type User struct {
	Profile Profile
}

func sendWelcomeEmail(ctx context.Context, email string) error { return nil }

type analyticsClient struct{}

func (analyticsClient) Track(ctx context.Context, name string, data any) error { return nil }

var analytics = analyticsClient{}

type contacts struct{}

func (contacts) Create(ctx context.Context, data any) error { return nil }

type crmClient struct{ Contacts contacts }

var crm = crmClient{}

func calculateRiskScoreWithNewModel(ctx context.Context, p Profile) (float64, error) { return 0, nil }

func legacyProcessor(ctx context.Context, fileID string) error { return nil }
func modernProcessor(ctx context.Context, fileID string) error { return nil }
