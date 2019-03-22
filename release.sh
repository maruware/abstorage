#!/bin/bash

if [ $# -ne 1 ]; then
  exit 1
fi

NEWVERSION=$1
git push origin master
git push origin --tags
npm run build
npm publish
