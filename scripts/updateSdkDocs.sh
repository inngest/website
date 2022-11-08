#!/bin/bash
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
docs_dir="$script_dir/../pages/docs/_reference/50-SDK"
tmp_dir=$(mktemp -d)
cd $tmp_dir
git clone git@github.com:inngest/inngest-js.git
cd inngest-js
git switch api-docs-generation-script
yarn
cd landing
yarn
cd ..
yarn run build
yarn run build:check --local
yarn docs:generate
mkdir -p $docs_dir
rm -r $docs_dir
cp -R docs $docs_dir
