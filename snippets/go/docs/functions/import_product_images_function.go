package functions

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func loadImportProductImagesInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		// config
		inngestgo.FunctionOpts{
			ID: "import-product-images",
		},
		// trigger (event or cron)
		inngestgo.EventTrigger("shop/product.imported", nil),
		// handler function
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// Here goes the business logic
			// By wrapping code in steps, it will be retried automatically on failure
			s3Urls, err := step.Run(ctx, "copy-images-to-s3", func(ctx context.Context) ([]string, error) {
				return copyAllImagesToS3(input.Event.Data["imageURLs"].([]string))
			})
			if err != nil {
				return nil, err
			}

			// You can include numerous steps in your function
			_, err = step.Run(ctx, "resize-images", func(ctx context.Context) (any, error) {
				return nil, ResizeImages(ResizerOpts{
					URLs:     s3Urls,
					Quality:  0.9,
					MaxWidth: 1024,
				})
			})
			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)
}

// !snippet:end
type ResizerOpts struct {
	URLs     []string
	Quality  float32
	MaxWidth int
}

func copyAllImagesToS3(s []string) ([]string, error) {
	panic("unimplemented")
}

func ResizeImages(opts ResizerOpts) error {
	panic("unimplemented")
}
