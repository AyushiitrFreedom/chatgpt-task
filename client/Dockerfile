# Base image
FROM node:latest

WORKDIR /usr/src/app

COPY package* .

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .


EXPOSE 3000

CMD ["npm", "run" , "start"]
