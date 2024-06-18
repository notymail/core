---
title: Updating
description: How-to update notymail
---

## 🐳 Docker

```bash
docker pull dafnik/notymail:latest

docker stop notymail
# If you are using systemd
# systemctl stop notymail

docker rm notymail

docker run -d -p 3124:3124 --restart=always --name notymail \
  -e API_KEYS='' \
  -e MAIL_SENDER='notymail <test@1.1.1.1>' \
  -e MAIL_HOST='gmail.com' \
  -e MAIL_PORT='587' \
  -e MAIL_SECURE='false' \
  -e MAIL_AUTH_USER='test@1.1.1.1' \
  -e MAIL_AUTH_PASSWORD='password' \
  dafnik/notymail:latest
```

Note: For every new release, it takes some time to build the docker image, please be patient if it is not available yet.

If you want to use the GitHub Docker Container Registry, use `ghcr.io/dafnik/notymail:latest`

## 🐳 Docker Compose

```bash
cd "<YOUR docker-compose.yml DIRECTORY>"
docker compose pull
docker compose up -d --force-recreate
```
