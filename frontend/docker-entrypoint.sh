#!/usr/bin/env sh
set -eu

# about environment variables https://serverfault.com/a/919212
envsubst '${UPSTREAM_SERVER} ${REAL_IP_FROM}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
