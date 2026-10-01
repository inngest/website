package versioning

import (
	"context"

	"github.com/inngest/inngestgo/step"
)

func changeStepID(ctx context.Context, user User) (float64, error) {
	// !snippet:start
	score, err := step.Run(ctx, "calculate-risk-score-v2", func(ctx context.Context) (float64, error) {
		return calculateRiskScoreWithNewModel(ctx, user.Profile)
	})
	// !snippet:end
	return score, err
}

var _ = changeStepID
