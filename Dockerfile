FROM node:16-alpine
LABEL maintainer="jf.arseneau@gmail.com"

COPY . /antennas4minisatip
WORKDIR "/antennas4minisatip"

RUN npm install

# Create volume for config directory to allow external configuration
VOLUME ["/antennas4minisatip/config"]

EXPOSE 5004
CMD ["npx", "--yes", "."]
