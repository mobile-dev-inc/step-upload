#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -ex

cd $SCRIPT_DIR

npm install .

npm run start
