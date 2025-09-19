package fanoutjobs

// !snippet:start

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/inngest/inngestgo"
)

func main() {
	// Initialize the Inngest SDK client
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "core",
	})
	if err != nil {
		panic(err)
	}

	// Initialize your HTTP server
	mux := http.NewServeMux()

	// Handle signup route
	mux.HandleFunc("/signup", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Parse request body - in a real app you'd validate the input
		var user struct {
			Email string `json:"email"`
		}
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Send event to Inngest
		_, err := client.Send(r.Context(), inngestgo.Event{
			Name: "app/user.signup",
			Data: map[string]interface{}{
				"user": map[string]interface{}{
					"email": user.Email,
				},
			},
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	})

	// Start the server
	log.Fatal(http.ListenAndServe(":8080", mux))
}

// !snippet:end
