# Backend API

Backend application built with Node.js, Express.js, PostgreSQL, and Prisma ORM.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the backend directory with the following content:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/service_system?schema=public"
   PORT=3000
   NODE_ENV=development
   ```
   Update the `DATABASE_URL` with your PostgreSQL credentials.

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

- `GET /health` - Health check endpoint that returns `{ status: "ok" }`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js    # Prisma client configuration
│   │   └── env.js          # Environment variables
│   ├── controllers/
│   │   └── healthController.js
│   ├── routes/
│   │   └── healthRoutes.js
│   └── index.js            # Express server entry point
├── prisma/
│   └── schema.prisma       # Prisma schema
├── package.json
└── README.md
```


