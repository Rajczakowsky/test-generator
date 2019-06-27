#!/bin/sh
#
# Pre commit hook to check for .only() in jest test files

TEST_FILES=$(find src/js/ -name "*.test.jsx")

VALIDATION_PASSED=true

for FILE in $TEST_FILES; do
	if grep -q ".only(" $FILE
	then
		printf ".only() found in: " $FILE
		VALIDATION_PASSED=false
	fi
done

if ! $VALIDATION_PASSED; then
	printf "\033[7;40;31m FAILED \033[0m .only() found in the above files, remove them\n"
	exit 1
fi

printf "\033[30;48;5;82m PASSED \033[0m Check for .only() in test files\n"

exit 0
