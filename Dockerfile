# Use an official Node runtime as the base image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY services/coherent/www/package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app source inside the Docker image
COPY services/coherent/www/ .

# Copy environment-specific .env file using build argument
ARG ENV=prod
COPY services/coherent/www/.env.${ENV} ./.env.local

# Build the app
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the app using CMD which defines your runtime
# Start the application in production mode
CMD ["npm", "run", "start"]
