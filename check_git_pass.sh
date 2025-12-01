#!/bin/bash

if [ -z "${GIT_PASS2+x}" ]; then
  echo "Environment variable GIT_PASS is NOT set."
  exit 1
fi