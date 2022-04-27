.PHONY: build
build: library
	yarn build

.PHONY: dirty
dirty:
	yarn prettier
	git diff --exit-code


.PHONY: library
library:
	curl -L https://github.com/inngest/library/releases/latest/download/library.json  > ./public/json/library.json
