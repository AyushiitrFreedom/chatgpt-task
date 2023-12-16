# Base image
FROM node:latest

WORKDIR /usr/src/app

COPY package* .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


EXPOSE 5000

CMD sh -c 'npm run generate ; npm run migrate ; npm run start'
