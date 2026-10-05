package durable_endpoints

// !snippet:start
import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/inngest/inngestgo/step"
	"github.com/inngest/inngestgo/stephttp"
)

// steps is the provider from stephttp.Setup, created once at startup.
func RegisterRoutes(mux *http.ServeMux, steps stephttp.Provider) {
	mux.HandleFunc("POST /api/orders", steps.HandleFunc(stephttp.FnOpts{}, handleOrder))
}

func handleOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body struct {
		OrderID string `json:"orderId"`
	}
	_ = json.NewDecoder(r.Body).Decode(&body)

	if body.OrderID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "orderId is required"})
		return
	}

	order, err := step.Run(ctx, "load-order", func(ctx context.Context) (Order, error) {
		return loadOrder(ctx, body.OrderID)
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	reservation, err := step.Run(ctx, "reserve-inventory", func(ctx context.Context) (Reservation, error) {
		return reserveInventory(ctx, order)
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"orderId":     body.OrderID,
		"reservation": reservation,
	})
}

// !snippet:end
