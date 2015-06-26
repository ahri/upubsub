#!/bin/bash

set -ue

cd "$(dirname "$0")"

if [ $# -lt 1 ]; then
    echo "Specify a benchmark:"
    ls *.js | sed 's,\.js$,,;s,^,    ,'
    exit 1
fi

../node_modules/watchy/bin/watchy -w $(echo ../*.js *.js | sed 's/ /,/g') -- node "$1.js"
