package non_retriable_errors

import (
	"fmt"

	"github.com/inngest/inngestgo"
)

func wrapCause(err error) (any, error) {
	// !snippet:start
	// Wrap with %w so errors.Is and errors.As still see the original error.
	return nil, inngestgo.NoRetryError(fmt.Errorf("orderId is invalid: %w", err))
	// !snippet:end
}

var _ = wrapCause
