package inngest_errors

// !snippet:start

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ItemRequestedData struct {
	ItemID string `json:"itemId"`
}

func FetchItem(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "fetch-item"},
		inngestgo.EventTrigger("store/item.requested", nil),
		func(ctx context.Context, input inngestgo.Input[ItemRequestedData]) (any, error) {
			itemID := input.Event.Data.ItemID
			if itemID == "" {
				return nil, inngestgo.NoRetryError(errors.New("itemId is required"))
			}

			return step.Run(ctx, "fetch-item", func(ctx context.Context) (map[string]any, error) {
				resp, err := http.Get(fmt.Sprintf("https://api.example.com/items/%s", itemID))
				if err != nil {
					return nil, err
				}
				defer resp.Body.Close()

				switch {
				case resp.StatusCode == http.StatusNotFound:
					return nil, inngestgo.NoRetryError(errors.New("item does not exist"))
				case resp.StatusCode == http.StatusTooManyRequests:
					// Go takes an absolute retry time rather than a duration.
					return nil, inngestgo.RetryAtError(
						errors.New("item API rate limit"),
						time.Now().Add(30*time.Second),
					)
				case resp.StatusCode >= 300:
					return nil, fmt.Errorf("item API returned %d", resp.StatusCode)
				}

				var item map[string]any
				err = json.NewDecoder(resp.Body).Decode(&item)
				return item, err
			})
		},
	)
}

// !snippet:end
