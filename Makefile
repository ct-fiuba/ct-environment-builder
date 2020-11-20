.PHONY: install
install:
	npm install;

.PHONY: run
run: install
	npm start;

.PHONY: run-development
run-development: install
	npm run start-development;

.PHONY: test
test:
	npm run test:integration

.PHONY: ping
ping:
	curl -vvv "localhost:5000/ping"

.PHONY: help
help:
	@echo 'Usage: make <target>'
	@echo ''
	@echo 'Available targets are:'
	@echo ''
	@grep -E '^\.PHONY: *' $(MAKEFILE_LIST) | cut -d' ' -f2- | sort
