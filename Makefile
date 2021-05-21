.PHONY: install
install:
	npm install;

.PHONY: run
run: install
	npm start -- users=$(users) establishments=$(establishments) mobility=$(mobility) days=$(days) n95Mandatory=$(n95Mandatory);

.PHONY: help
help:
	@echo 'Usage: make <target>'
	@echo ''
	@echo 'Available targets are:'
	@echo ''
	@grep -E '^\.PHONY: *' $(MAKEFILE_LIST) | cut -d' ' -f2- | sort
