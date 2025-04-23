# Stage 1: Build the React application
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

ARG BACKEND_API_ENDPOINT="http://localhost:8080"
ARG BACKEND_WS_ENDPOINT="ws://localhost:8000"
ARG BACKEND_API_ENDPOINT_SEARCH="http://localhost:8000"
ARG DEPLOY_ENDPOINT="http://localhost:3001"

ENV REACT_APP_BACKEND_API_ENDPOINT=${BACKEND_API_ENDPOINT}
ENV REACT_APP_BACKEND_WS_ENDPOINT=${BACKEND_WS_ENDPOINT}
ENV REACT_APP_BACKEND_API_ENDPOINT_SEARCH=${BACKEND_API_ENDPOINT_SEARCH}
ENV REACT_APP_DEPLOY_ENDPOINT=${DEPLOY_ENDPOINT}

# Build the app
RUN npm run build

# Stage 2: Serve the app with nginx
FROM docker.io/nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

RUN echo 'server { \
    listen 3001; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3001

# When the container starts, nginx will serve the app
CMD ["nginx", "-g", "daemon off;"]