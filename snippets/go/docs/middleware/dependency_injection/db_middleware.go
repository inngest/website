package dependency_injection

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/middleware"
)

// Assumes `Database` and `NewDatabase` are your own database client.
var db = NewDatabase()

type dbContextKey struct{}

// DatabaseMiddleware adds the shared database client to each function's
// context.Context.
type DatabaseMiddleware struct {
	middleware.BaseMiddleware
	db *Database
}

func (m *DatabaseMiddleware) TransformInput(
	ctx context.Context,
	call middleware.CallContext,
	input *middleware.TransformableInput,
) {
	input.WithContext(context.WithValue(input.Context(), dbContextKey{}, m.db))
}

// DatabaseFromContext returns the database client added by DatabaseMiddleware.
func DatabaseFromContext(ctx context.Context) *Database {
	d, _ := ctx.Value(dbContextKey{}).(*Database)
	return d
}

func NewClient() (inngestgo.Client, error) {
	return inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my-app",
		Middleware: []func() middleware.Middleware{
			func() middleware.Middleware { return &DatabaseMiddleware{db: db} },
		},
	})
}

// !snippet:end
