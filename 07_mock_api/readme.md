[← Back to Home](../readme.md)

# Mock API Server

The backend dependency for the Chapter 7 Fetch exercise series (`07_fetch_1` / `07_fetch_2` / `07_fetch_3`). Provides CRUD endpoints for user data. Data is stored in memory and resets to its initial state on restart.

## Quick Start

```bash
cd 07_mock_api
npm install
npm run dev
```

After starting, visit `http://localhost:3000` to view the API documentation.

---

## Endpoint List

| Method | Path | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get a single user |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |
| GET | `/reset` | Reset data to initial state |

### POST / PUT Request Body Format

Two formats are supported:

**JSON (recommended):**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com"}'
```

**www-form-urlencoded:**

```bash
curl -X POST http://localhost:3000/api/users \
  -d "name=Ada&email=ada@example.com"
```

### Response Format

User object structure:

```json
{
  "id": 1,
  "name": "Tom",
  "email": "tom@abc.com",
  "image": "/images/tom.png"
}
```

---

## API Testing

A `rest_client.http` file is provided in the project root, covering test cases for all endpoints including normal requests and error scenarios (404).

Usage: Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension in VS Code, open `rest_client.http`, and click **Send Request** above each request to send it.

> Make sure the Mock API server is running (`npm run dev`) before testing. If data has been modified during testing, visit `/reset` to restore the initial state in one step.

---

## Project Structure

```
07_mock_api/
  src/
    index.ts          ← Express application entry point, middleware and route registration
    routes/
      users.ts        ← /api/users route handlers (full CRUD)
    data/
      users.ts        ← In-memory data: initial user list and reset function
    types/
      user.ts         ← User interface definition
  public/
    images/           ← User avatar images
  dist/               ← TypeScript compiled output
```

## Technical Notes

- **Express v5**: routing and middleware
- **CORS**: allows cross-origin access from any domain (development-only configuration)
- **Data storage**: in-memory array; resets to initial state on restart; visit `/reset` to reset manually
- **TypeScript**: source code in `src/`, compiled to `dist/`, using ESM modules (`"type": "module"`)
