package versioning

// !snippet:start

import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

const cutoverTS = 1704067200000

type FileUploadedData struct {
	FileID string `json:"fileId"`
}

func ProcessUploadV1(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "process-upload"},
		inngestgo.EventTrigger("file/uploaded", inngestgo.StrPtr(fmt.Sprintf("event.ts < %d", cutoverTS))),
		func(ctx context.Context, input inngestgo.Input[FileUploadedData]) (any, error) {
			_, err := step.Run(ctx, "process-file", func(ctx context.Context) (any, error) {
				return nil, legacyProcessor(ctx, input.Event.Data.FileID)
			})
			return nil, err
		},
	)
}

func ProcessUploadV2(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "process-upload-v2"},
		inngestgo.EventTrigger("file/uploaded", inngestgo.StrPtr(fmt.Sprintf("event.ts >= %d", cutoverTS))),
		func(ctx context.Context, input inngestgo.Input[FileUploadedData]) (any, error) {
			_, err := step.Run(ctx, "process-file-v2", func(ctx context.Context) (any, error) {
				return nil, modernProcessor(ctx, input.Event.Data.FileID)
			})
			return nil, err
		},
	)
}

// !snippet:end
