package durable_endpoints

// !snippet:start
import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/inngest/inngestgo/step"
	"github.com/inngest/inngestgo/stephttp"
)

type API struct {
	steps stephttp.Provider
}

// GetCredits is registered by generated code, so the provider can't wrap it.
func (a API) GetCredits(w http.ResponseWriter, r *http.Request, accountID string) {
	// Use the returned w and r in the rest of the handler, and always defer end.
	w, r, end := a.steps.Start(w, r, stephttp.FnOpts{ID: "get-credits"})
	defer end()

	credits, err := step.Run(r.Context(), "load-credits", func(ctx context.Context) (Credits, error) {
		return loadCredits(ctx, accountID)
	})
	if err != nil {
		http.Error(w, "could not load credits", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(credits)
}

// !snippet:end
