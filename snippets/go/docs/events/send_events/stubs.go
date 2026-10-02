package send_events

import "context"

type apiClient struct{}

func (apiClient) FetchAllItems(ctx context.Context) ([]map[string]any, error) {
	return nil, nil
}

var api apiClient
