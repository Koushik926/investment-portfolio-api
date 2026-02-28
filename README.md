# Investment Portfolio Management API

Production-ready REST API for investment portfolio tracking using Node.js, Express, and MongoDB.

## Highlights

- JWT authentication + bcrypt password hashing
- MVC architecture
- Portfolio + asset CRUD
- Profit/Loss and portfolio value calculations
- Portfolio analytics endpoint
- Pagination
- Centralized error handling
- Request validation via express-validator
- Security hardening (helmet, rate limiting, mongo sanitize, compression)

## Tech Stack

- Node.js, Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `express-validator`
- `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `morgan`, `compression`

## Project Structure

```text
investment-portfolio-api/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
├── package.json
├── .env.example
└── postman-collection.json
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Create env file

```bash
cp .env.example .env
```

3. Fill `.env`

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/investment-portfolio
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> The app also accepts `MONGO_URI` as a backward-compatible alias.

4. Run server

```bash
npm run dev
```

## Base URL

- `http://localhost:3000`

## API Endpoints

### Public

- `GET /health`
- `GET /api`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protected (Bearer Token)

- `GET /api/auth/profile`
- `POST /api/portfolios`
- `GET /api/portfolios`
- `GET /api/portfolios/:portfolioId`
- `PUT /api/portfolios/:portfolioId`
- `DELETE /api/portfolios/:portfolioId`
- `POST /api/portfolios/:portfolioId/assets`
- `PUT /api/portfolios/:portfolioId/assets/:assetId`
- `DELETE /api/portfolios/:portfolioId/assets/:assetId`
- `GET /api/portfolios/analytics`

## Sample Flow

1. Register user (`/api/auth/register`)
2. Login and copy token (`/api/auth/login`)
3. Create portfolio (`/api/portfolios`)
4. Add asset (`/api/portfolios/:portfolioId/assets`)
5. Fetch portfolios (`/api/portfolios?page=1&limit=10`)
6. View analytics (`/api/portfolios/analytics`)

## Security Notes

- Passwords are hashed with bcrypt
- JWT-based stateless auth
- Rate limiting enabled
- Helmet security headers enabled
- MongoDB operator sanitization enabled
- Input validation on all write operations

## Resume-ready bullets

- Built a production-ready **RESTful API** using **Node.js**, **Express.js**, and **MongoDB (Mongoose)** with clean **MVC architecture**.
- Implemented secure **JWT Authentication** and **bcrypt password hashing** with protected routes and role-ready middleware structure.
- Designed portfolio logic for **profit/loss analytics**, **percentage returns**, and paginated portfolio retrieval for scalable API usage.
- Applied backend security best practices: **Helmet**, **rate limiting**, **input validation**, **MongoDB sanitization**, and centralized error handling.
- Documented and tested API workflows using **Postman**, clean JSON response contracts, and environment-based configuration.

## ATS Keywords (Backend Internship)

`Node.js`, `Express.js`, `MongoDB`, `Mongoose`, `REST API`, `JWT`, `bcrypt`, `Authentication`, `Authorization`, `Middleware`, `MVC Architecture`, `Input Validation`, `Error Handling`, `Rate Limiting`, `Helmet`, `API Security`, `Pagination`, `Postman`, `GitHub`, `Backend Development`

## What I Learned

- How stateless auth works end-to-end using JWT access tokens and auth middleware.
- How to model relational-like data in MongoDB with references (`User -> Portfolio -> Asset`).
- How to implement robust request validation and consistent API error contracts.
- How to secure backend services against abuse/injection with layered middleware.
- How to structure a backend codebase for maintainability, readability, and production readiness.

## Postman

Import `postman-collection.json` and set:

- `base_url = http://localhost:3000`

## License

MIT
