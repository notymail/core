---
title: Installation
description: How-to setup notymail
---

## 🐳 Docker

```bash
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

notymail is now running on <http://0.0.0.0:3124>.

### Changing port

```bash
docker run -d -p <YOUR_PORT>:3124 --restart=always --name notymail \
  -e API_KEYS='' \
  -e MAIL_SENDER='notymail <test@1.1.1.1>' \
  -e MAIL_HOST='gmail.com' \
  -e MAIL_PORT='587' \
  -e MAIL_SECURE='false' \
  -e MAIL_AUTH_USER='test@1.1.1.1' \
  -e MAIL_AUTH_PASSWORD='password' \
  dafnik/notymail:latest
```

### Docker Tags Description

| Tag(s) | Description                       |
| ------ | --------------------------------- |
| latest | Latest stable (👍Recommended Tag) |

## 🐳 Docker Compose

Example docker-compose template: https://github.com/Dafnik/notymail/blob/main/docker-compose.yml

```bash
docker-compose up -d
```

## (Optional) Reverse proxy

This is optional for someone who wants to use a reverse proxy.

More information: [Reverse proxy](../reverse-proxy)

## (Optional) Auto start systemd service

This is optional for someone who wants to use systemd autostart feature.

Create a service file at `/etc/systemd/system/notymail.service`

```bash
[Unit]
Description=notymail
Wants=syslog.service

[Service]
Restart=always
ExecStart=/usr/bin/docker start -a notymail
ExecStop=/usr/bin/docker stop -t 2 notymail

[Install]
WantedBy=multi-user.target
```

Now execute:

```bash
sudo systemctl enable notymail
sudo systemctl start notymail
```
