#!/usr/bin/env bash

npm run dist # Compile to .dmg

hub release create -c -F release-notes.md "v"$1 # Create github release