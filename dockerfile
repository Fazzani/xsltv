# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:11 as build

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR  /build
# Copy all local files into the image.
COPY . .

RUN npm install
# Build for production.
RUN npm run build -- --production

FROM node:11-alpine
# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Run From stagebuild
COPY --from=build /build/docs .
# Install `serve` to run the application.
RUN npm install -g serve
# Set the command to start the node server.
CMD serve -s /app
# Tell Docker about the port we'll run on.
EXPOSE 5000