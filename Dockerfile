# Build Stage
FROM node:18-alpine AS build

# Build args
ARG VITE_BACKEND_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE

# Set env variables during build process
ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration from repo
COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 3000
ENTRYPOINT ["nginx", "-g", "daemon off;"]