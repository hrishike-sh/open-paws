# Open Paws: Content Generator

## Features

- Multi platform drafts
- Edit drafts with AI
- Logging w/ Winston

## AI Usage

I used AI to make the Logging system and the Swagger API Documentation in backend

AI was used to help with the frontend

## Tech Stack

### Frontend

- **React 18**
- **Vite**
- **CSS3**

### Backend

- **Node.js & Express**
- **OpenAI API**
- **Swagger/OpenAPI**

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/hrishike-sh/open-paws.git
cd open-paws
```

### 2. Backend Configuration

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
OPENAI_API_KEY=api_key
BEARER=token
```

Note: I've sent the openai-api-key and bearer token in email

### 3. Frontend Configuration

Navigate to the `frontend` directory and install dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000`. API Docs are at `http://localhost:3000/api-docs`.

### Start the Frontend

```bash
cd frontend
npm run dev
```

The react app will start at `http://localhost:5173`.

# Documentation

First I started working on the backend, because I find it fun.

I went with OpenAI API since I have previously worked with it and it is pretty easy to implement.

We're using the SDK instead of http requests for the AI.

After setting up the basic expressjs folder setup and Router, I started work on the prompt and services/openai.

The prompt had to be precise and small so it didn't use a lot of tokens, and we had to make sure that the output is in our required format. So, I added the format to the prompt as well.

We could've gone a step further and used zod to verify the outputs but I chose not to because we were consistently getting the right outputs.

After this, I set up the basic REST request to get the AI Draft. After it was set up, it was time to secure our end point.

I added rate limits and hard coded a Bearer token that is required for the request to work. Without the bearer token, the request will just return 401.

The rate limit is 100 requests / 15 minutes.

I also used helmet (npmjs) to set the Headers for Auth etc.

After this, I used gemini to add a logger for our entire project, this will help us debug and analyze end points that cause issues.

After this, gemini was used to add Swagger Documentation, it is just boilerplate code for our requests.

After this frontend was developed using Vite, and the /ai/draft endpoint was changed to POST so it matches our swagger documentation and so the body is used properly.

In the frontend, I decided to go with a minimal look with just a form for the inputs and when the generate button is clicked, different tabs are shown for each: twitter, instagram, blog, email and press release

For each platform, two choices are given. The user can choose between them or the user can edit the given choice using AI again.

Once the user chooses the options, he/she is then redirected to a final summary page.

I was planning to add a way to instantly post the posts / emails / blogs. But I don't know if that was needed for this task. But to add this, we'll just ask the user to login using different platform's OAuth.

Maybe, we can also add images that can be generated tailored to the content that has been generated but then again, AI images are way too obvious and look bad sometimes (in my opinion)

Rigth now, each request takes around ~1500 tokens. That's 2000 requests / 1$

Personally, if I had to implement this considering it is for personal use, I'd just implement this into our primary social media (Discord/Slack etc.) which would be much more accessible.
