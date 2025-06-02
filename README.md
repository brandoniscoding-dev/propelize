# 🚀 Propelize

[![Node.js](https://img.shields.io/badge/Node.js-v22-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-blue)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v17-blue)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6-orange)](https://sequelize.org/)
[![Docker](https://img.shields.io/badge/Docker-v26-blue)](https://www.docker.com/)
[![Vitest](https://img.shields.io/badge/Vitest-v3-brightgreen)](https://vitest.dev/)

**Propelize** is a secure, modular, and scalable RESTful Node.js API for managing users and their vehicles. Built with **Express**, **PostgreSQL**, and **Sequelize**, it follows best practices for clean architecture, security, and extensibility.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Best Practices](#-best-practices)
- [Run with Docker](#-run-the-project-with-docker)
- [Main Endpoints](#-main-endpoints)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Team](#-propelize-project-team)

---

## 📦 Features

- 🔐 **Secure Authentication**: JWT-based signup, login, and token refresh.
- 👤 **User Management**: Create, read, update, and delete user profiles (admin-only for certain operations).
- 🚗 **Vehicle Management**: Full CRUD operations for vehicles, tied to authenticated users.
- 📊 **Health Monitoring**: Healthcheck endpoint for server status.
- 🧹 **Input Validation**: Robust validation using Joi schemas.
- 🐳 **Dockerized Deployment**: Run the app and database with a single command.
- 🧪 **Comprehensive Testing**: Unit and integration tests with Vitest.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v18)
- **Framework**: Express (v4)
- **Database**: PostgreSQL (v15) with Sequelize ORM (v6)
- **Authentication**: JSON Web Tokens (jsonwebtoken)
- **Validation**: Joi
- **Logging**: Morgan
- **CORS**: Enabled with `cors`
- **Testing**: Vitest (v1.5.0)
- **Containerization**: Docker & Docker Compose

---

## 🧠 Best Practices

- **Layered Architecture**: Separation of concerns (controllers, services, models).
- **SOLID Principles**: Modular and maintainable codebase.
- **Error Handling**: Centralized error middleware for consistent responses.
- **Security**: Password hashing with bcrypt, JWT authentication, input validation.
- **Production-Ready**: Logging, environment configuration, Docker support.

---

## 🚀 Run the Project with Docker

> ⚠️ Ensure Docker and Docker Compose are installed. Create a `.env` file before starting.

### 1. Clone the Repository

```bash
git clone https://github.com/brandoniscoding-dev/propelize.git
cd propelize
```

### 2. Create the `.env` File

Create a `.env` file at the root with the following:

```env
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=propelize

JWT_SECRET=myVerySecretKey
JWT_EXPIRES_IN=1h
```

> ℹ️ `DB_HOST=db` corresponds to the Docker service name in `docker-compose.yml`.

### 3. Build and Run

```bash
docker-compose up --build
```

The API will be available at [http://localhost:3000](http://localhost:3000).

### 4. Stop the Containers

To stop and remove containers:

```bash
docker-compose down
```

---

## 🧪 Main Endpoints

| Method | URL                        | Description                       | Authentication         | Parameters/Body                                   |
|--------|----------------------------|-----------------------------------|------------------------|--------------------------------------------------|
| POST   | `/api/auth/signup`         | Register a new user               | None                   | `username`, `email`, `password`, `role` (optional) |
| POST   | `/api/auth/login`          | Authenticate a user               | None                   | `email`, `password`                              |
| POST   | `/api/auth/refresh-token`  | Refresh access token              | None                   | `refreshToken`                                   |
| GET    | `/api/users`               | List all users                    | Admin (JWT)            | None                                             |
| GET    | `/api/users/me`            | Get a user by ID                  | Admin or self (JWT)    | `me`                                             |
| GET    | `/api/users/:id`           | Get a user by ID                  | Admin                  | `id` (path)                                      |
| PUT    | `/api/users/:id`           | Update a user                     | Admin or self (JWT)    | `username`, `email`, `password` (optional)        |
| DELETE | `/api/users/:id`           | Delete a user                     | Admin (JWT)            | `id` (path)                                      |
| GET    | `/api/vehicles`            | List all vehicles for a user      | User (JWT)             | None                                             |
| POST   | `/api/vehicles`            | Add a new vehicle                 | User (JWT)             | `make`, `model`, `year`, `licensePlate`          |
| GET    | `/api/vehicles/:id`        | Get a vehicle by ID               | User (JWT)             | `id` (path)                                      |
| PUT    | `/api/vehicles/:id`        | Update a vehicle                  | User (JWT)             | `make`, `model`, `year`, `licensePlate` (partial) |
| DELETE | `/api/vehicles/:id`        | Delete a vehicle                  | User (JWT)             | `id` (path)                                      |
| GET    | `/health`                  | Check server health               | None                   | None                                             |

> 🔐 **Authentication**: Endpoints requiring JWT expect an `Authorization` header: `Bearer <token>`.

---

## 📁 Project Structure

```bash
propelize/
├── src/
│   ├── config/        # Database and environment configuration
│   ├── controllers/   # Route handlers and business logic
│   ├── middlewares/   # Authentication, error handling, and validation
│   ├── models/        # Sequelize models (User, Vehicle)
│   ├── routes/        # Express route definitions
│   ├── seeders/       # Database initialization scripts
│   ├── services/      # Business logic services
│   ├── utils/         # Utility functions (e.g., JWT handling)
│   ├── validators/    # Joi validation schemas
│   ├── app.js         # Express app setup
│   └── server.js      # Server entry point
├── tests/
│   ├── integration/   # Integration tests
│   └── unit/          # Unit tests for services, utils, validators
├── docker-compose.yml # Docker services (API, PostgreSQL)
├── Dockerfile         # API container definition
├── package.json       # Dependencies and scripts
├── README.md          # Project documentation
```

---

## 🧪 Testing

The project includes **unit** and **integration** tests using **Vitest**:

- **Unit Tests**: Cover services (`auth.service.js`, `user.service.js`, `vehicle.service.js`), utilities (`token.util.js`), and validators.
- **Integration Tests**: Test controller behavior with mocked dependencies.

Run tests:

```bash
npm run test
```

> ℹ️ Ensure the database is mocked or running for integration tests.

---

## 👥 Propelize Project Team

**Project Lead**:
- **BrandonIscoding** – [brandoniscoding.dev@gmail.com](mailto:brandoniscoding.dev@gmail.com)

**Contributors**:
- **LettyCoding** – [laetitia.maffo21@facsciences-uy1.cm](mailto:laetitia.maffo21@facsciences-uy1.cm)
- **Lorine** – [lorinasandrao@gmail.com](mailto:lorinasandrao@gmail.com)
- **RoyLaFouine** – [fouinybabyroy@gmail.com](mailto:fouinybabyroy@gmail.com)
- **Salifuh** – [syusahou@gmail.com](mailto:syusahou@gmail.com)

---
