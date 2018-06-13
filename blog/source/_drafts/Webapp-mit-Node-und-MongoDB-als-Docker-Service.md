title: Webapp mit Node und MongoDB als Docker-Service
tags:
---

1. Project-Structure

webapp
|- db-vol/
|- app/
|- Dockerfile
|- docker-compose.yml
|- vars.env

2. Datenbank-Vorbereitung

docker run --rm --name db-init -v /path/to/webapp/db-vol:/data/db -d mongo --auth

docker exec --ti db-init bash

mongo -> User Creation -> Collections

3. Environment Variables

4. Webapp

5. Dockerfile

6. docker-compose.yml



