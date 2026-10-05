package human_in_the_loop

// !snippet:start
import (
	"encoding/json"
	"net/http"

	"github.com/inngest/inngestgo"
)

// NOTE - This is pseudo code for handling Slack interactions, please review their docs for implementation
func SlackInteractions(client inngestgo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload struct {
			User    struct{ ID string } `json:"user"`
			Actions []struct {
				Value string `json:"value"`
			} `json:"actions"`
		}
		if err := json.Unmarshal([]byte(r.FormValue("payload")), &payload); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		var value struct {
			ApprovalID string `json:"approvalId"`
			Approved   bool   `json:"approved"`
		}
		if err := json.Unmarshal([]byte(payload.Actions[0].Value), &value); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		reason := ""
		if !value.Approved {
			reason = "Rejected via Slack"
		}

		// Send the event using the client
		_, err := client.Send(r.Context(), inngestgo.Event{
			Name: "agent/approval.response",
			Data: map[string]any{
				"approvalId":  value.ApprovalID,
				"approved":    value.Approved,
				"respondedBy": payload.User.ID,
				"reason":      reason,
			},
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		text := "❌ Rejected"
		if value.Approved {
			text = "✅ Approved"
		}
		_ = json.NewEncoder(w).Encode(map[string]string{"text": text})
	}
}

// !snippet:end
