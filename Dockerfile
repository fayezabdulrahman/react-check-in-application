# Build Stage
FROM node:18-alpine AS build
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

# add env.sh to docker-entrypoint.d
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]