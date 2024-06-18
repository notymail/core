---
title: Reverse proxy
description: How-to setup notymail with a reverse proxy
---

In order to expose notymail to the web securely, it is recommended to proxy it behind a traditional webserver such as nginx or Apache.
Below are some example configurations that you could use.

## Nginx (With SSL)

```nginx
server {
  listen 443 ssl http2;
  # Remove '#' in the next line to enable IPv6
  # listen [::]:443 ssl http2;
  server_name notymail.your_domain.your_tld;
  ssl_certificate     /path/to/ssl/cert/crt;
  ssl_certificate_key /path/to/ssl/key/key;
  # *See "With SSL (Certbot)" below for details on automating ssl certificates

  location / {
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   Host $host;
    proxy_pass         http://localhost:3124/;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
  }
}
```

## Nginx (Without SSL)

```nginx
server  {
  listen 80;
  # Remove '#' in the next line to enable IPv6
  # listen [::]:80;

  server_name notymail.your_domain.your_tld;

  location / {
    proxy_pass         http://localhost:3124;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_set_header   Host $host;
  }
}
```

## Nginx (With SSL Certbot)

```nginx
server {
  # If you don't have one yet, you can set up a subdomain with your domain registrar (e.g. Namecheap)
  # Just create a new host record with type='A Record', host='<subdomain>', value='<ip_address>'.

  server_name notymail.your_domain.your_tld;

  location / {
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   Host $host;
    proxy_pass         http://localhost:3124/;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
  }
}

# Once that's completed, you can run
# sudo apt install python3-certbot-nginx
# sudo certbot --nginx -d your_domain -d notymail.your_domain.your_tld
# And Certbot will auto-populate this nginx .conf file for you, while also renewing your certificates automatically in the future.
```

## Apache

With SSL:

```apache
<VirtualHost *:443>
  ServerName notymail.your_domain.your_tld
  SSLEngine On
  SSLCertificateFile /path/to/ssl/cert/crt
  SSLCertificateKeyFile /path/to/ssl/key/key
  # Protocol 'h2' is only supported on Apache 2.4.17 or newer.
  Protocols h2 http/1.1
  ProxyPreserveHost on
  ProxyPass / http://localhost:3124/
  RewriteEngine on
  RewriteCond %{HTTP:Upgrade} =websocket
  RewriteRule /(.*) ws://localhost:3124/$1 [P,L]
  RewriteCond %{HTTP:Upgrade} !=websocket
  RewriteRule /(.*) http://localhost:3124/$1 [P,L]
</VirtualHost>
```

Without SSL:

```apache
<VirtualHost *:80>
  ServerName notymail.your_domain.your_tld
  ProxyPreserveHost on
  ProxyPass / http://localhost:3124/
  RewriteEngine on
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteCond %{HTTP:Connection} upgrade [NC]
  RewriteRule ^/?(.*) "ws://localhost:3124/$1" [P,L]
</VirtualHost>
```

## Caddy

```nginx
notymail.your_domain.your_tld {
    reverse_proxy 127.0.0.1:3124
}
```

## Caddy with Docker-compose

If you run notymail using Docker-Compose and don't already have a reverse proxy, this is a simple way to configure Caddy.

```yml
version: '3'
networks:
  default:
    name: 'proxy_network'
services:
  notymail:
    #   HERE BELONGS THE docker-compose.yml snippet
    labels:
      caddy: notymail.your_domain.your_tld
      caddy.reverse_proxy: '* {{upstreams 3124}}'
  caddy:
    image: 'lucaslorentz/caddy-docker-proxy:ci-alpine'
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /srv/caddy/:/data
    restart: unless-stopped
    environment:
      - CADDY_INGRESS_NETWORKS=proxy_network
```

Replace `notymail.your_domain.your_tld` with your domain.

## Https-Portal

Example docker-compose.yml file using Https-Portal:

```yml
version: '3.3'

services:
  https-portal:
    image: steveltn/https-portal:1
    ports:
      - '80:80'
      - '443:443'
    links:
      - notymail
    restart: always
    environment:
      DOMAINS: 'notymail.your_domain.your_tld -> http://notymail:3124'
      STAGE: 'production'
      # FORCE_RENEW: 'true'
      WEBSOCKET: 'true'
    volumes:
      - https-portal-data:/var/lib/https-portal

#   HERE BELONGS THE docker-compose.yml snippet

volumes:
  https-portal-data:
```

Replace `notymail.your_domain.your_tld` with your domain

## Traefik

```yml
labels:
  - 'traefik.enable=true'
  - 'traefik.http.routers.notymail.rule=Host(`YourOwnHostname`)'
  - 'traefik.http.routers.notymail.entrypoints=https'
  - 'traefik.http.routers.notymail.tls=true'
  - 'traefik.http.routers.notymail.tls.certresolver=myresolver'
  - 'traefik.http.services.notymail.loadBalancer.server.port=3124'
```

Replace `notymail.your_domain.your_tld` with your domain

When setup correctly, Traefik can automatically get a Let’s Encrypt certificate for your service.
