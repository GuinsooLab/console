#!/bin/zsh

set -e

NGINX=nginx:1.23.1
CONF_PATH=/Users/admin/Git/Public/console/nginx-integration/conf
CONTAINER_NAME=console-nginx

# pull nginx-docker
docker pull $NGINX

# start/restart nginx service
docker run --name $CONTAINER_NAME --network=host -p 7001:7001 -v $CONF_PATH:/etc/nginx/conf.d $NGINX
