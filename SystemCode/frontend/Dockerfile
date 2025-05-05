# frontend/Dockerfile for development (not production)
FROM node:18 as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./ 
RUN npm install

# Copy the rest of the source code
COPY frontend/ .

# Expose port for development server
EXPOSE 5173

# Start the development server (not for production)
CMD ["npm", "run", "dev"]
