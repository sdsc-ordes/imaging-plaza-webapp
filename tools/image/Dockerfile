# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY ./src/imaging-plaza-webapp/package*.json ./

# Install app dependencies
RUN npm install
RUN npx browserslist@latest --update-db

# Copy the rest of the application code
COPY ./src/imaging-plaza-webapp/ .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
ENTRYPOINT ["sh", "entrypoint.sh"]
