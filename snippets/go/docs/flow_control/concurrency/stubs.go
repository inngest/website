package concurrency

import "context"

func processFile(ctx context.Context, fileURI string) error { return nil }

type fileBucket struct{}

func (fileBucket) Fetch(ctx context.Context, uri string) ([]byte, error) { return nil, nil }

var bucket fileBucket
