# Sezzle Calculator Test

A full-stack calculator application featuring a React (TypeScript) frontend and a Go backend microservice.

## Features

- **Arithmetic Operations**: Addition, Subtraction, Multiplication, Division, Exponentiation, Square Root, Percentage.
- **Responsive Design**: Polished UI built with Tailwind CSS and shadcn/ui.
- **Input Validation**: Robust handling of edge cases (e.g., division by zero, negative square roots).
- **Full-Stack Deployment**: Dockerized setup combining frontend and backend.

## Project Structure

- `/src`: React frontend source code.
- `/backend-go`: Go backend source code.
- `/server.ts`: Express backend (used for live preview in AI Studio).
- `/tests`: Unit tests for the API and components.
- `Dockerfile`: Multi-stage build for production deployment.

## Setup Instructions

### Local Development (Node.js/Express)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (Frontend + Express Backend):
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Go Backend Development

1. Navigate to the backend directory:
   ```bash
   cd backend-go
   ```
2. Run the Go server:
   ```bash
   go run main.go
   ```
   The server will start on port 8080.

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t sezzle-calculator .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:8080 sezzle-calculator
   ```

## API Usage

### `POST /api/calculate`

Performs an arithmetic operation.

**Request Body:**
```json
{
  "operation": "add",
  "a": 10,
  "b": 5
}
```

**Operations:** `add`, `subtract`, `multiply`, `divide`, `power`, `sqrt`, `percentage`.

**Response:**
```json
{
  "result": 15
}
```

## Design Decisions

- **Frontend**: Used React with Tailwind CSS for a modern, responsive interface. Framer Motion (via `motion`) provides smooth transitions.
- **Backend**: Implemented a RESTful API in Go for high performance and type safety. A fallback Express backend is provided for compatibility with the AI Studio preview environment.
- **Architecture**: Decoupled frontend and backend allows for independent scaling and testing.
- **Testing**: Comprehensive unit tests for both layers ensure reliability and catch regressions.
