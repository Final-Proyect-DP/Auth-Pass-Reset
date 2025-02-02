# Use the official Node.js image as the base image
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Install build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --build-from-source

# Copy the rest of the application code
COPY . .

# Rebuild native modules
RUN npm rebuild bcrypt --build-from-source

# Expose the port the app runs on
EXPOSE 3013

# Command to run the application
CMD ["npm", "start"]