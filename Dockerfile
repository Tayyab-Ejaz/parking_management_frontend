# Use the official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package configuration files
COPY package.json package-lock.json /app/

# Install project dependencies using npm
RUN npm install

# Copy the rest of the project files
COPY . /app/

# Expose the port and start the development server
EXPOSE 3000
CMD ["npm", "start"]
