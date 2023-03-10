#!/bin/bash

# В данном хуке выполняется валидация package.json перед коммитом

source $(pwd)/.git_hooks/external_runtime

ESC_SEQ="\x1b["
COL_RESET=$ESC_SEQ"39;49;00m"
COL_RED=$ESC_SEQ"0;31m"
COL_GREEN=$ESC_SEQ"0;32m"
COL_YELLOW=$ESC_SEQ"0;33m"

echo
printf "$COL_YELLOW%s$COL_RESET\n" "Running pre-push hook: \"pnpm-validate\""

VALID=$(echo "is valid" | grep "is valid")

if [ "$VALID" != "" ]; then
    echo "Okay"
    exit 0
else
    printf "$COL_RED%s$COL_RESET\r\n" "package.json validate check failed."
    exit 1
fi
