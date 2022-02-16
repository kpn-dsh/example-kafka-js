# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10-slim

# Install minimal requirements
RUN apt-get update && apt-get install -y curl && apt-get install -y openssl && printenv
# Setup USER
ARG id
RUN groupadd --gid $id dshdemo
RUN useradd --no-create-home --uid $id --gid $id dshdemo
RUN mkdir -p /home/node/app
RUN chown -R $id:$id /home/node/app \
    && chmod -R o-rwx /home/node/app

# Work directory
WORKDIR /home/node/app

ENV PKI_CONFIG_DIR=/home/node/app/

# entrypoint
ADD ./dsh/docker-entrypoint.sh /entrypoint.sh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./
RUN npm install
COPY --chown=node . .

# switch from root to user
USER $id
ENTRYPOINT [ "/entrypoint.sh" ]
