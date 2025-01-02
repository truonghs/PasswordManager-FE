# My Front End GoPass

Welcome to **My Front End GoPass**! This is a ReactJS application designed to show the information and the gopass service. Follow the instructions below to get started with the project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Directory Structure](#directory-structure)
- [Architecture Diagram](#architecture-diagram)
- [Settings](#settings)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://classic.yarnpkg.com/)
- [git](https://git-scm.com/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/alex-go-nguyen/jerry-demo-1-fe
    ```

2. Navigate into the project directory:

    ```bash
    cd jerry-demo-1-fe
    ```

3. Install the project dependencies:

    Using npm:

    ```bash
    npm install
    ```

    Or using Yarn:

    ```bash
    yarn install
    ```
    ```
## Directory Structure
![image](https://github.com/user-attachments/assets/d2840d66-3870-4887-b3a8-999be60a7b09)

## Settings

At the root of the project, create a .env file and add the following environment variables
```
VITE_API_URL=

VITE_EXTENSION_URL=

VITE_CLIENT_URL=

VITE_SENTRY_URL = 

VITE_SENTRY_AUTH_TOKEN =

VITE_CLOUD_NAME = 

VITE_UPLOAD_ASSETS_NAME = 

VITE_CLOUDINARY_UPLOAD_URL = 

VITE_CAPTCHAR_SITE_KEY = 

VITE_OPEN_STREET_MAP_API_URL =

VITE_ENCRYPTION_KEY=

VITE_ENCRYPTION_IV=

VITE_SOCKET_URL = dthAGMX0SFovOIfG
```
## Architecture Diagram
![GoPass Architecture Diagram](https://github.com/user-attachments/assets/c6846892-310f-42a3-beb1-d58ddd7fb513)

## Running the Project

To start the development server and run the project locally, use the following command:

Using npm:

```bash
npm run dev
```

## Deployment

The website is deployed with Vercel: [GoPass](https://gopassjerry.vercel.app/) 
