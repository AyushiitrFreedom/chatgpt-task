# Amazon-clone


This README provides step-by-step instructions for setting up and running the project. Please follow these instructions carefully to ensure a smooth setup process.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (v6.0.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v9.6.0 or higher)
- [Yarn](https://yarnpkg.com/) (optional but recommended)

## Installation

### Step 1: Clone the Project

```shell
git clone <project-repository-url>
```

Replace `<project-repository-url>` with the URL of your project repository.

### Step 2: Navigate to the Server Directory

```shell
cd server
```

### Step 3: Install Server Dependencies

```shell
npm install
```

### Step 4: Navigate Back to the Project Root Directory

```shell
cd ../
```

### Step 5: Navigate to the Client Directory

```shell
cd client
```

### Step 6: Install Client Dependencies

```shell
npm install
```

### Step 7: Create a PostgreSQL Database

Follow the instructions in the provided video to create a PostgreSQL database , make user of name = srk , password = ddlj and database = amazon  [Database Setup Video](https://www.youtube.com/watch?v=0Il040ExA_Q)

### Step 8: Navigate Back to the Project Root Directory

```shell
cd ../
```

### Step 9: Navigate to the Server Directory Again

```shell
cd server
```



### Step 11: Generate Necessary Files

```shell
yarn generate
```

### Step 12: Run Database Migrations

```shell
yarn migrate
```

### Step 13: Build the Server

```shell
yarn build
```

### Step 14: Start the Server

```shell
yarn start
```

### Step 15: Navigate Back to the Project Root Directory

```shell
cd ../
```

### Step 16: Navigate to the Client Directory Again

```shell
cd client
```

### Step 17: Build the Client

```shell
npm run build
```

### Step 18: Start the Client

```shell
npm start
```

## Running the Project

After completing the installation steps, your project should be up and running. Access the client application in your web browser, and the server should be available at the configured server endpoint.

If you encounter any issues or have questions, please refer to the project's documentation or contact the project maintainers for assistance. Enjoy working on your project!
