# 🚀 Propelize

**Propelize** is a RESTful Node.js API designed to manage users and their vehicles with a modular, secure, and extensible architecture.
The project uses **PostgreSQL**, **Sequelize**, **Express**, and follows best development practices.

---

## 📦 Features

* 🔐 JWT Authentication (signup, login)
* 👤 User management
* 🚗 Vehicle CRUD per user
* 📊 Healthcheck endpoint for monitoring (actuator)
* 📁 Modular and scalable structure
* 🐳 Docker-ready (1 command to run)

---

## 🚀 Run the project with Docker

> ⚠️ Before launching, create a `.env` file at the root with the environment variables below.

### 1. Clone the repo

```bash
git clone https://github.com/brandoniscoding-dev/propelize.git

cd propelize
```

### 2. Create the `.env` file

Create a `.env` file in the root folder with the following content:

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

> 🧠 `DB_HOST=db` matches the Docker service name in `docker-compose.yml`.

### 3. Run Docker

```bash
docker-compose up --build
```

The API will be available at [http://localhost:3000](http://localhost:3000)

---

## 🧪 Main Endpoints

| Method | URL             | Description       |
| ------ | --------------- | ----------------- |
| GET    | `/api/vehicles` | List all vehicles |
| POST   | `/api/vehicles` | Add a new vehicle |

---

## 📁 Project Structure

```bash
src/
├── config/        # App and DB configuration
├── controllers/   # Route business logic
├── middlewares/   # Auth, error, validation middleware
├── models/        # Sequelize models
├── routes/        # Express routes
├── seeders/       # Database initialization
├── services/      # Business services
├── utils/         # Utility functions (e.g. JWT)
├── validators/    # Validation schemas
├── app.js         # Express app configuration
└── server.js      # Server entry point
```

---

## 📌 Tech Stack

* Node.js + Express
* PostgreSQL
* Sequelize ORM
* Docker & Docker Compose
* JWT
* Joi (validation)
* Morgan, Cors

---

## 🧠 Best Practices

* Clear **layered architecture** (controller / service / model)
* Follows **SOLID principles**
* **Production-ready** (error handling, logs, Docker, DB init)

---

### 👥 Propelize Project Team

Project led by:

* **BrandonIscoding** (Project Lead) – [`@brandoniscoding`](mailto:brandoniscoding.dev@gmail.com)

Main contributors:

* **LettyCoding** – [`@lettycoding`](mailto:laetitia.maffo21@facsciences-uy1.cm)
* **Lorine** – [`@lorine`](mailto:lorinasandrao@gmail.com)
* **RoyLaFouine** – [`@roylafouine`](mailto:fouinybabyroy@gmail.com)
* **Salifuh** – [`@salifuh`](mailto:syusahou@gmail.com)
