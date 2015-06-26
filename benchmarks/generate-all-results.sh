#!/bin/sh

set -ue

for b in *.js; do
    echo $b
    node $b
    echo "====================="
    echo
done > results.txt
