# Base image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4010

# Start the application
CMD ["npm", "start"]
