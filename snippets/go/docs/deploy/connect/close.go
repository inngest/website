package connect

import (
	"github.com/inngest/inngestgo/connect"
)

func closeConnection(conn connect.WorkerConnection) error {
	// !snippet:start
	// Close blocks until in-flight steps are flushed and the connection is closed
	err := conn.Close()
	// Connection is now closed
	// !snippet:end
	return err
}
