#!/bin/bash

# Discard changes to files where the lines added and lines removed is the same and less or equal than 2
# in order to ignore changes solely to time updated or sb version
git diff --numstat | awk '($1 <= 2) && ($2 <= 2) && ($1 == $2) { a=(a "./"$3" ") } END { print a | "git restore "a }'

# Sea creature names oscillate between '???' and actual names, so ignore the diff if it contains question marks
if grep -q -wi "???" ./API/skyblock_skills.json; then
   git restore ./API/skyblock_skills.json
fi
