.PHONY: help
.DEFAULT_GOAL := help
SHELL=bash

UID := $(shell id -u)

dc_path=./docker-compose.yaml
dc_path_quick_test=./docker-compose.quick-test.yaml
clickhouse_container=basicrum_clickhouse_server_build
grafana_container=basicrum_grafana

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Starts the environment
	env UID=${UID} docker-compose -f ${dc_path} build
	env UID=${UID} docker-compose -f ${dc_path} up -d

down: ## Stops the environment
	env UID=${UID}  docker-compose -f ${dc_path} down


up_quick_test: ## Starts quick test environment
	env UID=${UID} docker-compose -f ${dc_path_quick_test} build
	env UID=${UID} docker-compose -f ${dc_path_quick_test} up

down_quick_test: ## Stops quick test  environment
	env UID=${UID}  docker-compose -f ${dc_path_quick_test} down

restart: down up # Restart the environment

rebuild: ## Rebuilds the environment from scratch
	@/bin/echo -n "All the volumes will be deleted. You will loose data in DB. Are you sure? [y/N]: " && read answer && \
	[[ $${answer:-N} = y ]] && make destroy

destroy: ## Destroys thel environment
	docker-compose -f ${dc_path} down --volumes --remove-orphans
	docker-compose -f ${dc_path} rm -vsf

jump_clickhouse: ## Jump to the ClickHouse container
	docker-compose -f ${dc_path} exec ${clickhouse_container} bash

jump_grafana: ## Jump to the Grafana container
	docker-compose -f ${dc_path} exec ${grafana_container} bash

.PHONY: docker/local/build
docker/local/build:
	docker build -t dashboard .