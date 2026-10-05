package durable_endpoints

// !snippet:start
import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/inngest/inngestgo/step"
	"github.com/inngest/inngestgo/stephttp"
)

func Router(steps stephttp.Provider) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /accounts/{id}/credits", listCredits)
	mux.HandleFunc("GET /healthz", healthz)

	// Wrap the whole router. With chi, use r.Use(steps.Middleware(...)).
	return steps.Middleware(stephttp.MiddlewareOpts{})(mux)
}

// healthz never calls Configure, so it isn't a function and makes no calls to Inngest.
func healthz(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func listCredits(w http.ResponseWriter, r *http.Request) {
	// Opt in on the first line, before the handler reads the request body.
	stephttp.Configure(r.Context(), func(o *stephttp.FnOpts) {
		o.ID = "list-credits"
	})

	credits, err := step.Run(r.Context(), "load-credits", func(ctx context.Context) (Credits, error) {
		return loadCredits(ctx, r.PathValue("id"))
	})
	if err != nil {
		http.Error(w, "could not load credits", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(credits)
}

// !snippet:end
