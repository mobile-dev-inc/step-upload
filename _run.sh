#!/bin/bash

set -e

pwd

ncc build index.ts
node ./dist/index.js
