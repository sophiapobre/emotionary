# emotionary

*emotionary* is a journaling app with sentiment analysis that helps users reflect on their moods through visual insights. Our app offers a seamless and intuitive user experience, complete with features such as tagging, favoriting, filtering, and search. Our top priority is user privacy, and we securely encrypt journal entry content using password-based key derivation.

## Table of Contents
- [Developers](#developers)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Test Suite](#test-suite)
- [Getting Started](#getting-started)

## Developers

- Annie Chung
- Kathleen Tom
- Lavender Yu
- Sophia Pobre

## Technologies Used

- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [Express.js](https://expressjs.com/) - backend web application framework for building RESTful APIs with Node.js
- [MongoDB Atlas](https://www.mongodb.com/atlas) - cloud database that uses a JSON-like document data model
- [React](https://react.dev/) - JavaScript library for building component-based user interfaces
- [Redux](https://redux.js.org/) - JavaScript library for global state management
- [Material UI](https://mui.com/) - React component library
- [Vite](https://vite.dev/) - frontend build tool
- [Hugging Face Inference API: distilbert-based Multilingual Sentiment Classification Model by Tabularis.AI](https://huggingface.co/tabularisai/multilingual-sentiment-analysis) - used for sentiment analysis
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - used for client-side encryption
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) - used to support Google logins
- [Mocha](https://mochajs.org/) - JavaScript test framework that runs on Node.js
- [Chai](https://www.chaijs.com/) - JavaScript assertion library for Node.js

## Features
- Homepage
![homepage]()

- Registration and login system
![registration_login]()

- Create, edit, view, and delete journal entries
![core_ux](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/e8c44c74-a5c0-4d9e-ad98-a6a1ea0f8319)

- Mood insights
![insights](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/4c6d559a-5ab3-4d1d-8154-c2aa98ed22a9)

- Filter entries by start/end dates, mood, tag, favorites, and/or deleted
![filtering](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/0c0d04e8-bd54-4c68-9e15-c3881d9f7691)

- Search entries by title, content, or tags
![search](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/6c65279a-7e91-44c2-8c15-08502de5c39c)

- Time Capsule feature to write a letter to your future self
![time_capsule](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/8f76ffab-8f6a-4f85-8192-d2efc4b034d1)

- Client-side encryption for journal entry content
![encryption](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/0712c9ba-0c9b-4336-9cbc-48012bae86a1)

- ML for sentiment analysis
![sentiment](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/0d151348-79ff-486d-aa59-6fb4a8f57e3f)

- Mental health indicator and resources
![health](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/e697efcf-ed3b-4e1f-87c6-6a455340f047)

- Daily prompts to guide reflection
![daily_prompts](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/33a17f60-7446-4e21-903f-6fbe4c5c7940)

- Dark mode for user accessibility and to reduce eye strain
![dark_mode](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/fa421744-476a-42a4-aba6-2637ff23d8f5)

- Ability to soft/hard delete and restore entries
![delete](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/b9f5bcd3-3f46-410a-8525-a2a82b55b6a9)

- Tutorial for first-time users
![tutorial](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/assets/20702/1313d30d-219b-4acf-8b20-d0adb6135830)

## Test Suite
We implemented a comprehensive test suite using the Mocha and Chai testing frameworks, as well as mongodb-memory-server and supertest. Our backend tests cover all API routes for entries, tags, and users; our frontend tests cover filtering for our search functionality. Additionally, we used mochawesome to generate our test reports.

### Instructions to run
1. Please follow Steps #1 and #2 below from [Getting Started](#instructions-to-run-1)
    - Clone this repo, go to the `FinalRelease` branch, and add the `.env` file
2. If you would like to run the test suite image separately, run `docker compose up --build test`
4. Otherwise, follow the remaining instructions below, and test reports will be automatically generated in Step #6

### Links
- [Backend tests](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/tree/FinalRelease/Backend/test)
- [Frontend tests](https://github.students.cs.ubc.ca/CPSC455-2025S/team15/tree/FinalRelease/Frontend/test)

## Getting Started
The following credentials need to be included in your `.env` file:
- `GOOGLE_ID`
- `MONGODB_ID`
- `RESEND_API_KEY`
- `VITE_GOOGLE_ID`
- `VITE_HUGGINGFACE_ID`

### Instructions to run
1. Clone this repo
2. Replace the `.env.example` file in the root directory with your `.env` file
3. Run `docker compose up --build`
4. Backend API runs at: http://localhost:5000
5. Frontend will be available at: http://localhost
    - Please login using our test user:
        - Email: testhash@email.com
        - Password: testingthehash
    - Email account for Time Capsule:
        - email: emotionary@yahoo.com
        - password: emotionSlary1$!
6. Tests reports are automatically generated in the project's root directory in the `test-results` folder and can be opened in your browser of choice:
    - `backend-test-report.html`
    - `frontend-test-report.html`