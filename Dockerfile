# Use Node.js LTS version as base image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build Next.js app
RUN npm run build

# Expose the port Next.js is listening on (usually 3000)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
