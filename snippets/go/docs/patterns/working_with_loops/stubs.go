package working_with_loops

import "context"

type Item struct {
	ID string `json:"id"`
}

type Page struct {
	Items      []Item
	NextCursor *string
}

type sourceClient struct{}

func (sourceClient) ListPage(ctx context.Context, cursor *string) (Page, error) { return Page{}, nil }

type storeClient struct{}

func (storeClient) UpsertMany(ctx context.Context, items []Item) error { return nil }

var (
	source = sourceClient{}
	store  = storeClient{}
)

func processItem(ctx context.Context, itemID string) (any, error) { return nil, nil }
