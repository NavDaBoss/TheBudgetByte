# BudgetByte User Manual

Welcome to the source code for BudgetByte, a health and wealth app aimed to track and analyze grocery spending.
This application is built with Next.js, React, TypeScript, MUI components, and Firebase. It uses Tesseract's OCR API to parse receipt data and ChatGPT's API to extract the individual items from the raw OCR text and categorize the data.

## Core Features

- Create an account to be able to save your grocery spending data with us.
- Upload any grocery receipt and have it automatically processed by our application.
- Have the ability to gain a visual breakdown of your monthly and yearly grocery spending by cost and food group category.
- Have the ability to manually create, delete, or edit any items that haven't been parsed or categorized correctly by our app.

## Setup

#### Clone the repository

Run the following command to clone the repository locally:

```bash
git clone https://github.com/NavDaBoss/TheBudgetByte.git
```

#### Adding the API Keys

Create a .env.local file in the root directory of the project and add the following environment variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
OPENAI_API_KEY=
```

> We have purposely left these API keys blank for security reasons. These can be provided to you upon request.

#### Install the necessary dependencies

Run the following command to install all of the necessary dependencies with npm:

```bash
npm install
```

## Getting Started

#### Running the application locally

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
