# emotionary
 
*emotionary* is a journaling web app that uses machine learning for sentiment analysis, helping users track mood trends through clear visual insights. Our app offers a seamless and intuitive user experience, complete with features such as tagging, favoriting, filtering, and search. Our top priority is user privacy, and we securely encrypt journal entry content using password-based key derivation.

The app is deployed using **Vercel** for both frontend and backend, and supports local development via Docker.

You can demo the app [here](https://emotionary-ubc.vercel.app).

## Table of Contents

- [Developers](#developers)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [Test Suite](#test-suite)

## Developers

This project was created by a team of four [UBC Computer Science](https://www.cs.ubc.ca/) students:

- Sophia Pobre
- Annie Chung
- Kathleen Tom
- Lavender Yu

## Technologies Used

### Frontend
- [React](https://react.dev/) - JavaScript library for building component-based user interfaces
- [Redux](https://redux.js.org/) - JavaScript library for global state management
- [Material UI](https://mui.com/) - React component library
- [Vite](https://vite.dev/) - frontend build tool

### Backend
- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [Express.js](https://expressjs.com/) - backend web application framework for building RESTful APIs with Node.js
- [Mongoose](https://mongoosejs.com/docs/) - MongoDB object modeling
- [MongoDB Atlas](https://www.mongodb.com/atlas) - cloud database with JSON-like document data model

### Testing
- [Mocha](https://mochajs.org/) - JavaScript test framework that runs on Node.js
- [Chai](https://www.chaijs.com/) - JavaScript assertion library for Node.js

### Other Technologies
- [Hugging Face Inference API: distilbert-based Multilingual Sentiment Classification Model by Tabularis.AI](https://huggingface.co/tabularisai/multilingual-sentiment-analysis) - for sentiment analysis
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - for client-side encryption
- [Resend API](https://resend.com/) - for sending emails
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) - used to support Google logins
- [Vercel](https://vercel.com/) – for automated builds and deployments  
- [Docker](https://www.docker.com/) – for local development environment

## Features

- Homepage
 <img width="1470" height="797" alt="Screenshot 2025-08-11 at 4 05 41 pm" src="https://github.com/user-attachments/assets/c17da8e4-5d7b-4a9d-940f-7d4029d5ffd7" />

- Sign up
 <img width="1470" height="799" alt="Screenshot 2025-08-11 at 4 17 24 pm" src="https://github.com/user-attachments/assets/d5adecbf-55ee-4000-84ca-f4f7a2f50896" />

- Sign in
 <img width="1470" height="798" alt="Screenshot 2025-08-11 at 4 08 34 pm" src="https://github.com/user-attachments/assets/4f7c380e-e096-4919-b512-4fcc67f50f9a" />

- Create, edit, view, and delete journal entries
 <img width="1327" height="556" alt="e8c44c74-a5c0-4d9e-ad98-a6a1ea0f8319" src="https://github.com/user-attachments/assets/cb50fb35-4041-41e2-b01d-df50fc3d71a3" />

- Create, edit, select, and delete tags
 <img width="1338" height="771" alt="Screenshot 2025-08-11 at 4 30 56 pm" src="https://github.com/user-attachments/assets/df9fcca4-96fd-48f4-9867-7331f635ce66" />

- Mood insights
 <img width="1326" height="1633" alt="4c6d559a-5ab3-4d1d-8154-c2aa98ed22a9" src="https://github.com/user-attachments/assets/6c9ff87d-0cc2-4140-9e7f-3cc5c131c3dd" />

- Filter entries by start/end dates, mood, tag, favorites, and/or deleted
 <img width="1193" height="504" alt="0c0d04e8-bd54-4c68-9e15-c3881d9f7691" src="https://github.com/user-attachments/assets/83bfc142-be30-4037-abae-ede9e0241cbf" />

- Search entries by title, content, or tags
 <img width="963" height="500" alt="Screenshot 2025-11-14 at 8 15 14 pm" src="https://github.com/user-attachments/assets/fedbf864-59cb-4e5e-b2e0-fe1398f2ee36" />

- Time Capsule feature to write a letter to your future self
 <img width="1208" height="1136" alt="8f76ffab-8f6a-4f85-8192-d2efc4b034d1" src="https://github.com/user-attachments/assets/d4028a70-fae1-45b8-a53f-b6a4b227cda8" />

- Client-side encryption for journal entry content
 <img width="1390" height="472" alt="0712c9ba-0c9b-4336-9cbc-48012bae86a1" src="https://github.com/user-attachments/assets/e7acadc9-f73d-47f8-b81a-ac9b6a31cf0c" />

- ML for sentiment analysis
 <img width="1060" height="602" alt="0d151348-79ff-486d-aa59-6fb4a8f57e3f" src="https://github.com/user-attachments/assets/1724d09f-4ddf-4329-b4a1-16e1ac12ba0f" />

- Mental health indicator and resources
 <img width="614" height="863" alt="e697efcf-ed3b-4e1f-87c6-6a455340f047" src="https://github.com/user-attachments/assets/98d47584-ef6a-43b1-8fbe-7a95ac33064e" />

- Daily prompts to guide reflection
 <img width="1250" height="483" alt="33a17f60-7446-4e21-903f-6fbe4c5c7940" src="https://github.com/user-attachments/assets/7bcc1828-505d-4fff-807f-89f9e0e0c6b4" />

- Dark mode for user accessibility and to reduce eye strain
 <img width="1538" height="463" alt="fa421744-476a-42a4-aba6-2637ff23d8f5" src="https://github.com/user-attachments/assets/083534e8-b841-44a5-896d-c6ac2389c39e" />

- Ability to soft-delete, hard-delete, and restore entries
 <img width="1489" height="602" alt="b9f5bcd3-3f46-410a-8525-a2a82b55b6a9" src="https://github.com/user-attachments/assets/aa585dcc-1d4c-48e2-ae16-6bebaa72a023" />

- Tutorial for first-time users
 <img width="1080" height="528" alt="1313d30d-219b-4acf-8b20-d0adb6135830" src="https://github.com/user-attachments/assets/d9bde3db-eeef-4370-80ba-69cdcbdedd60" />

## Getting Started

### Prerequisites
You will need to have credentials for [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2), [MongoDB Atlas](https://www.mongodb.com/atlas), [Resend API](https://resend.com/), and [Hugging Face API](https://huggingface.co/tabularisai/multilingual-sentiment-analysis).

Create a `.env.example` file with the following credentials:
- `GOOGLE_ID` - your Google OAuth 2.0 Client ID
- `MONGODB_ID` - your MongoDB URI
- `RESEND_API_KEY` - your Resend API key
- `VITE_GOOGLE_ID` - your Google OAuth 2.0 Client ID
- `VITE_HUGGINGFACE_ID` - your Hugging Face API key
- `VITE_API_URL=http://localhost:3000`

### Running the app locally
1. Clone this repository:

   ```bash
   git clone https://github.com/sophiapobre/emotionary.git
   ```

2. Replace the `.env.example` file in the root directory with your `.env.example` file
3. Install dependencies for both the frontend and backend:
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```
4. Start the backend server:
   ```bash
   cd Backend && npm run dev
   ```
5. In a new terminal, start the frontend server:
   ```bash
   cd Frontend && npm run dev
   ```
6. Access the app:
   - Launch your browser and go to [http://localhost:5174](http://localhost:5174) to access the frontend.
   - The backend API will also be available for you to test at [http://localhost:3000](http://localhost:3000).

### Running the app on Docker
1. Clone this repository:

   ```bash
   git clone https://github.com/sophiapobre/emotionary.git
   ```

2. Replace the `.env.example` file in the root directory with your `.env.example` file
3. Build and start all services:
   ```bash
   docker compose up --build
   ```
4. Access the app:
   - Launch your browser and go to [http://localhost:5174](http://localhost:5174) to access the frontend.
   - The backend API will also be available for you to test at [http://localhost:3000](http://localhost:3000).
5. Test reports are automatically generated in the project's root directory in the `test-results` folder and can be opened in your browser:
    - `backend-test-report.html`
    - `frontend-test-report.html`
6. To stop running the app, press `Ctrl+C` in the terminal, and then run:
   ```bash
   docker compose down
   ```

## Test Suite
We implemented a comprehensive test suite using the Mocha and Chai testing frameworks, as well as Vitest for frontend testing and Supertest for API testing. Our backend tests cover all API routes for entries, tags, and users; our frontend tests cover filtering for our search functionality. Additionally, we used mochawesome to generate our test reports.

### Running tests locally
1. Clone this repository:

   ```bash
   git clone https://github.com/sophiapobre/emotionary.git
   ```

2. Replace the `.env.example` file in the root directory with your `.env.example` file
3. Install dependencies for both the frontend and backend:
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```
4. Run backend tests:
   ```bash
   cd Backend && npm test
   ```
5. Run frontend tests:
   ```bash
   cd Frontend && npm test
   ```
6. Test reports will be generated in the project's root directory in the `/test-results` folder.

### Running tests on Docker
1. Clone this repository:

   ```bash
   git clone https://github.com/sophiapobre/emotionary.git
   ```

2. Replace the `.env.example` file in the root directory with your `.env.example` file
3. To run the test suite separately:
   ```bash
   docker compose up --build test
   ```
4. Or run the full application (which includes test generation):
   ```bash
   docker compose up --build
   ```
5. Test reports will be automatically generated in the project's root directory in the `/test-results` folder.

### Links
- [Backend tests](https://github.com/sophiapobre/emotionary/tree/be1f0ed7bc43d72e03ad3d0ccde990cf52e82df6/Backend/test)
- [Frontend tests](https://github.com/sophiapobre/emotionary/tree/be1f0ed7bc43d72e03ad3d0ccde990cf52e82df6/Frontend/test)
