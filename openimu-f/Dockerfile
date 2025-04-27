# Build stage
FROM node:23.11.0 AS build

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN yarn build

# Serve stage
FROM nginx:stable-alpine

# Copy the built React app from the build stage to the nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]