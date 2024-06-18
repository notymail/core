# notymail

<a target="_blank" href="https://github.com/dafnik/notymail"><img src="https://img.shields.io/github/stars/dafnik/notymail?style=flat" /></a>
<a target="_blank" href="https://hub.docker.com/r/dafnik/notymail"><img src="https://img.shields.io/docker/pulls/dafnik/notymail" /></a>
<a target="_blank" href="https://hub.docker.com/r/dafnik/notymail"><img src="https://img.shields.io/docker/v/dafnik/notymail/latest?label=docker%20image%20ver." /></a>
[![GitHub Sponsors](https://img.shields.io/github/sponsors/dafnik?label=GitHub%20Sponsors)](https://github.com/sponsors/dafnik)

## ⭐ Features

- Send emails from any environment

## 🔧 How to Install

### 🐳 Docker

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

> [!NOTE]
> If you want to limit exposure to localhost (without exposing port for other users or to use a [reverse proxy](https://notymail.dafnik.me/getting-started/reverse-proxy)), you can expose the port like this:
>
> ```bash
> docker run -d -p 127.0.0.1:3124:3124 --restart=always --name notymail \
> -e API_KEYS='' \
> -e MAIL_SENDER='notymail <test@1.1.1.1>' \
> -e MAIL_HOST='gmail.com' \
> -e MAIL_PORT='587' \
> -e MAIL_SECURE='false' \
> -e MAIL_AUTH_USER='test@1.1.1.1' \
> -e MAIL_AUTH_PASSWORD='password' \
> dafnik/notymail:latest
> ```

### Advanced Installation

If you need more options or need to browse via a reverse proxy, please read:

https://notymail.dafnik.me/getting-started/installation

## 🆙 How to Update

https://notymail.dafnik.me/getting-started/update

## Motivation

- Needed an easy way to send emails from CIs.
- Wanted a somewhat secure solution with api keys.
- Wanted to build something with hono/js.

Liking this project? please consider giving it a ⭐.
