# My React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Overview

[This application](https://tashikani-counter.vercel.app/) is a React app for users to register attacks and view attack history.

## Setup

### Prerequisites

- Node.js (version 14 or above)
- yarn

### Installation

Clone the repository and install the dependencies.

```bash
git clone https://github.com/soranjiro/tashikani-counter.git
cd tashikani-counter
yarn install
```

Usage
Start the development server by running the following command.

```bash
yarn start
```

Open http://localhost:3000 in your browser to view the application.

Running Tests
Launch the test runner by running the following command.

```bash
yarn test
```

Build
Build the application by running the following command.

```bash
yarn build
```

The built application will be saved in the build directory.

Setting Environment Variables
Create a .env file in the root of the project and set the following environment variables.

```bash
REACT_APP_SHEET_ID=your_google_sheet_id
REACT_APP_REFRESH_TOKEN=your_refresh_token
REACT_APP_CLIENT_ID=your_client_id
REACT_APP_CLIENT_SECRET=your_client_secret
```

## Deployment
This application has a GitHub Actions workflow set up for deploying to GitHub Pages. Pushing to the main branch will automatically trigger the deployment.

## Manual Deployment

This project uses Vercel for deployment. Any changes merged into the main branch will automatically trigger a deployment to Vercel.
