package connect

import (
	"os"

	"github.com/inngest/inngestgo"
)

func newAppVersionClient() (inngestgo.Client, error) {
	// !snippet:start
	// You can set the app version to any environment variable, you might use
	// a build number ('v2025.02.12.01'), git commit sha ('f5a40ff'), or
	// a custom value ('my-app-v1').
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID:      "my-app",
		AppVersion: inngestgo.StrPtr(os.Getenv("MY_APP_VERSION")), // Use any environment variable you choose
	})
	// !snippet:end
	return client, err
}
