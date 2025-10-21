A robust RESTful backend built with Node.js, Express, and PostgreSQL, powering the AI Experimentation Dashboard.
It handles experiment creation, retrieval, and data persistence for AI-generated results, ensuring scalable and consistent performance.

🏗️ Architecture Overview
llm-backend/
├── src/
│   ├── index.ts          # Entry point
│   ├── routes/           # Express routes
│   ├── controllers/      # Route logic and handlers
│   ├── services/         # Business logic / AI integration layer
│   ├── models/           # Database models or Prisma schema
│   └── utils/            # Helpers and config
├── package.json
├── tsconfig.json
└── .env

⚙️ Tech Stack
Layer	Technology
Runtime	Node.js (v18+)
Framework	Express.js
Language	TypeScript
Database	PostgreSQL 17
ORM / Client	Prisma
Deployment	Render
Logging & Error Handling	Custom middleware + console-based logs
🚀 Features

✅ Create AI experiments dynamically via REST API
✅ Persist prompts, responses, and evaluation metrics in PostgreSQL
✅ Fetch and visualize experiment data via frontend
✅ Clean modular structure following MVC principles
✅ Strong typing with TypeScript
✅ Ready for horizontal scaling and cloud deployment

📦 Installation

Clone the backend repository:

git clone https://github.com/<your-username>/llm-backend.git
cd llm-backend


Install dependencies:

npm install

🔐 Environment Variables

Create a .env file in the root of the project and include:

DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
PORT=5000
NODE_ENV=development


If using Prisma, run migrations:

npx prisma migrate dev

🧠 Scripts
Command	Description
npm run dev	Run in development with Nodemon
npm run build	Compile TypeScript into dist/
npm start	Start compiled production server
📡 API Endpoints
Method	Endpoint	Description
GET	/api/experiments	Fetch all experiments
POST	/api/generate-experiment	Create and store a new experiment
GET	/api/db-check	Verify database connection

Example:

POST /api/generate-experiment

{
  "prompt": "What are ethical considerations in AI deployment?",
  "parameters": { "temperature": [0.7], "topP": [0.9] }
}


Response:

{
  "id": 42,
  "prompt": "What are ethical considerations in AI deployment?",
  "results": "[{\"response\": \"AI ethics include...\"}]",
  "createdAt": "2025-10-21T12:00:00Z"
}

 Development Notes

Uses TypeScript strict mode for better type safety.

All responses are JSON-formatted and versioned under /api/*.

Database layer separated from route logic for clean maintainability.

Logs are color-coded and structured for production observability.

Health check route available: /api/db-check.

☁️ Deployment

Deployed automatically via Render with PostgreSQL add-on.
Ensure environment variables are configured under Render Dashboard → Environment.

Backend URL:
https://llm-qou7.onrender.com

🧑‍💻 Author

Benjamin Mwangi
Senior Software Engineer / AI Systems Developer
📧 mwangib297@gmail.com
🌐https://github.com/Benjamwas
