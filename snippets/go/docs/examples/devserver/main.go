package devserver

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
)

func main() {

	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my_app",
	})

	client.Send(context.Background(), inngestgo.Event{
		Name: "user.avatar.uploaded",
		Data: map[string]any{"url": "https://a-bucket.s3.us-west-2.amazonaws.com/..."},
	})
}

// !snippet:end
