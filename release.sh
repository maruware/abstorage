#!/bin/bash

if [ $# -ne 1 ]; then
  echo "need newversion arg"
  exit 1
fi

NEWVERSION=$1
npm version $1
git push origin master
git push origin --tags
npm run build
npm publish
