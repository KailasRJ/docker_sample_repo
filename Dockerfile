# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Install Supervisor and Flask
RUN apt-get update && apt-get install -y supervisor python3-pip
RUN pip3 install flask

# Copy the Node.js server files
COPY node-server/ /app/node-server/

# Copy the Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy the Python server files
COPY python-server/ /app/python-server/

# Expose port for Node.js server
EXPOSE 3000

# Start Supervisor to manage Node.js server
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
