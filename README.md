# Blog API Project

A simple RESTful Blog API built using Node.js, Express, Prisma ORM, PostgreSQL, and JWT-based authentication with Passport.js. This project allows users to register, login, and perform CRUD operations on posts and comments while protecting routes via JWT authentication.

## Features

- User registration and login with hashed passwords
- JWT token issuance on successful login
- Protected routes via Passport-JWT strategy
- Full CRUD operations for Posts and Comments
- Prisma ORM with PostgreSQL for data management
- Relation handling between Users, Posts, and Comments
- Error handling for all API endpoints

## Tech Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Passport.js (JWT Strategy)
- bcryptjs (for password hashing)
- jsonwebtoken
- dotenv
- cors


## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/MANOJ-80/Blog-Api.git
cd Blog-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and set your variables:

```ini
DATABASE_URL="postgresql://username:password@localhost:5432/blogdb"
JWT_SECRET="yoursecretkey"
PORT=5000
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```

Server will run at http://localhost:5000

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | User login (returns JWT token) |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts/ | Get all posts |
| GET | /api/posts/:id | Get a specific post by ID |
| POST | /api/posts/add | Create a new post (auth required) |
| PUT | /api/posts/update/:id | Update a post (auth required) |
| DELETE | /api/posts/delete/:id | Delete a post (auth required) |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/posts/:id/comment | Add comment to a post (auth required) |
| GET | /api/posts/:id/comments | Get all comments for a post |
| GET | /api/posts/:id/comment/:commentId | Get a specific comment |
| PUT | /api/posts/:id/comment/:commentId | Update a comment (auth required) |
| DELETE | /api/posts/:id/comment/:commentId | Delete a comment (auth required) |

## Authentication

JWT token issued on successful login. Token must be included in the Authorization header for protected routes:

```
Authorization: Bearer <your_token_here>
```

## Notes

- No server-side logout (as JWT is stateless). Logout is handled by removing the token on the client side.
- Protected routes use `passport.authenticate('jwt', { session: false })` middleware.
- User passwords are securely hashed with bcryptjs before storage.

## Future Improvements

- Token blacklist implementation for server-side logout
- Role-based authorization (e.g., admin vs normal user)
- Pagination for posts and comments
- Unit tests for API endpoints
- Frontend dashboard for post and comment management

## License

This project is licensed under the [MIT License](LICENSE) — feel free to use and modify as you like.

## Credits

Developed by [0xEcho](https://github.com/MANOJ-80)
Special thanks to the Odin Project / Instructor guidance.

