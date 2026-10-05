package human_in_the_loop

// !snippet:start
import (
	"encoding/json"
	"net/http"

	"github.com/inngest/inngestgo"
)

// Register with: mux.HandleFunc("POST /api/approvals/{approvalId}/respond", RespondToApproval(client))
func RespondToApproval(client inngestgo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		approvalID := r.PathValue("approvalId")
		var body struct {
			Approved bool   `json:"approved"`
			Reason   string `json:"reason"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		_, err := client.Send(r.Context(), inngestgo.Event{
			Name: "agent/approval.response",
			Data: map[string]any{
				"approvalId":  approvalID,
				"approved":    body.Approved,
				"respondedBy": currentUserID(r),
				"reason":      body.Reason,
			},
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_ = json.NewEncoder(w).Encode(map[string]string{"status": "response_recorded"})
	}
}

// !snippet:end
