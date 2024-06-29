# Use a more recent Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your application code
COPY . .

# Build Next.js app
RUN npm run build

# Expose the port Next.js is listening on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]