# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory to /app
WORKDIR /app

# Install Supervisor, Flask, and Python dependencies
RUN apt-get update && \
    apt-get install -y supervisor python3-dev python3-pip && \
    pip3 install --upgrade pip && \
    pip3 install flask

# Copy the Node.js server files
COPY node-server/ /app/node-server/

# Copy the Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set the working directory to /app/node-server
WORKDIR /app/node-server

# Install Node.js dependencies
RUN npm install

# Expose ports for Node.js and Python servers
EXPOSE 3000
EXPOSE 6000

# Start Supervisor to manage Node.js server
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
