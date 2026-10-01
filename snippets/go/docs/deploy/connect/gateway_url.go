package connect

import (
	"context"
	"net/url"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/connect"
)

func connectSelfHosted(ctx context.Context, client inngestgo.Client) (connect.WorkerConnection, error) {
	// !snippet:start
	conn, err := inngestgo.Connect(ctx, inngestgo.ConnectOpts{
		Apps: []inngestgo.Client{client},
		RewriteGatewayEndpoint: func(endpoint url.URL) (url.URL, error) {
			gateway, err := url.Parse("ws://my-cluster-host:8289/v0/connect")
			if err != nil {
				return endpoint, err
			}
			return *gateway, nil
		},
	})
	// !snippet:end
	return conn, err
}
