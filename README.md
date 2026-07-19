# <h1>🚀 Redis Learning</h1>

A comprehensive Redis learning project built with **Node.js**, **Express.js**, **MongoDB**, **Redis**, and **BullMQ**. This project demonstrates some of the most common real-world Redis use cases that every backend developer should know, including **Caching**, **OTP Management**, **Rate Limiting**, and **Background Job Processing**.

---

# 📌 Table of Contents

- Introduction
- Tech Stack
- Features
- Project Structure
- Installation
- Environment Variables
- Running the Project
- Redis Topics Covered
  - 1. Redis Caching
  - 2. OTP Storage & Verification
  - 3. Rate Limiting
  - 4. Background Job Processing
- Redis Commands Used
- API Endpoints
- Workflow
- Learning Outcomes
- Author

---

# 📖 Introduction

Redis is an in-memory data structure store commonly used for caching, session management, temporary data storage, queues, and rate limiting. Since Redis stores data in RAM instead of disk, it provides extremely fast read and write operations.

This project is designed to understand Redis from beginner to intermediate level through practical implementations instead of only theory.

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Cache / Queue

- Redis
- BullMQ
- ioredis

### Tools

- Postman
- dotenv

---

# ✨ Features

- User CRUD
- Redis Caching
- OTP Generation & Verification
- API Rate Limiting
- Background Job Processing
- BullMQ Queue
- Worker Process
- MongoDB Integration

---

# 📁 Project Structure

```
Redis Learning/
│
├── lib/
│   ├── db.js
│   └── sendEmail.js
│
├── middleware/
│   └── ratelimit.js
│
├── model/
│   └── user.model.js
│
├── worker.js
├── queue.js
├── index.js
├── .env
└── package.json
```

---

# ⚙ Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Start Redis Server

```bash
redis-server
```

Run Express Server

```bash
npm run dev
```

Run Worker

```bash
node worker.js
```

---

# 🔐 Environment Variables

Create a `.env` file

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

REDIS_URL=redis://localhost:6379
```

---

# 🔥 Redis Topics Covered

---

# 1️⃣ Redis Caching

## What is Caching?

Caching stores frequently accessed data inside Redis so that repeated requests do not hit MongoDB every time.

Instead of querying the database repeatedly, the application first checks Redis.

If the data exists inside Redis (**Cache Hit**), it returns immediately.

If the data doesn't exist (**Cache Miss**), MongoDB is queried, the data is stored inside Redis, and then returned to the client.

This implementation follows the **Cache Aside (Lazy Loading)** pattern.

---

## Workflow

```
Client
   │
   ▼
Express Server
   │
   ▼
Check Redis
   │
 ┌─┴──────────────┐
 │                │
 │ Cache Hit      │ Cache Miss
 │                │
 ▼                ▼
Return Data    MongoDB
                   │
                   ▼
            Save into Redis
                   │
                   ▼
             Return Response
```

---

## Why use Caching?

- Faster API response
- Reduces Database Load
- Better Performance
- Improves Scalability

---

# 2️⃣ OTP Storage & Verification

## Purpose

Redis is an excellent place to store temporary data such as OTPs because it supports automatic expiration.

Instead of saving OTPs inside MongoDB, Redis stores them for a limited time.

Example

```
Key

otp:user@gmail.com

Value

458921

Expire

30 Seconds
```

If the OTP expires, Redis automatically removes it.

---

## Workflow

```
User
   │
   ▼
Request OTP
   │
   ▼
Generate OTP
   │
   ▼
Store OTP in Redis
(EX 30 Seconds)
   │
   ▼
User Receives OTP
   │
   ▼
Verify OTP
   │
   ▼
Redis Checks OTP
   │
 ┌─────────────┐
 │             │
Correct      Incorrect
 │             │
 ▼             ▼
Delete OTP   Error
 │
 ▼
Verified
```

---

## Why use Redis?

- Very Fast
- Temporary Storage
- Automatic Expiration
- No Database Cleanup Required

---

# 3️⃣ Rate Limiting

## Purpose

Rate Limiting prevents users from sending too many requests within a short period.

Example

```
Allowed

10 Requests

Per Minute
```

If the limit is exceeded,

Redis blocks additional requests until the timer resets.

Redis maintains a request counter for every user or IP address.

---

## Workflow

```
User
   │
   ▼
API Request
   │
   ▼
Redis Counter
   │
 ┌─────────────┐
 │             │
Limit OK     Limit Exceeded
 │             │
 ▼             ▼
Allow       Block Request
```

---

## Benefits

- Prevents API Abuse
- Protects Servers
- Prevents DDoS
- Controls Traffic

---

# 4️⃣ Background Job Processing (BullMQ)

## Purpose

Background Job Processing allows time-consuming tasks to run separately from the main request-response cycle.

For example,

When a user registers,

The application should immediately return

```
User Created Successfully
```

instead of waiting for the email to be sent.

The email task is placed into a Queue.

A Worker processes that task in the background.

---

## Components

### Producer

Creates Jobs

```
emailQueue.add(...)
```

---

### Queue

Stores Waiting Jobs

Redis acts as the queue storage.

---

### Worker

Continuously listens to the queue.

When a job arrives,

It processes it.

---

### Task

Actual work

Example

```
Send Email
```

---

## Workflow

```
User
   │
   ▼
Create User
   │
   ▼
MongoDB
   │
   ▼
Create Email Job
   │
   ▼
Redis Queue
   │
   ▼
Return Response
(User Created Successfully)
   │
   ▼
Worker Picks Job
   │
   ▼
sendEmail()
   │
   ▼
Email Sent
```

---

## Advantages

- Faster Response
- Better User Experience
- Scalable
- Retry Failed Jobs
- Doesn't Block API

---

# 📚 Redis Commands Used

| Command | Description |
|----------|-------------|
| `SET` | Store Data |
| `GET` | Retrieve Data |
| `DEL` | Delete Data |
| `EX` | Set Expiration Time |
| `EXPIRE` | Add Expiry to Existing Key |
| `TTL` | Check Remaining Expiration Time |
| `INCR` | Increment Counter |
| `DECR` | Decrement Counter |
| `EXISTS` | Check if Key Exists |

---

# 🌐 API Endpoints

## Create User

```
POST /create
```

Creates a user and adds an email job to the queue.

---

## Get Users

```
GET /get
```

Fetches users from MongoDB.

---

## Get Users with Redis Cache

```
GET /get-with-redis
```

Returns cached data if available.

---

## Send OTP

```
POST /send-otp
```

Generates and stores OTP inside Redis.

---

## Verify OTP

```
POST /verify-otp
```

Verifies the OTP stored in Redis.

---

# 🎯 Learning Outcomes

After completing this project, you will understand:

- What Redis is
- Why Redis is faster than databases
- Redis Caching
- Cache Aside Pattern
- Lazy Loading
- Cache Hit
- Cache Miss
- OTP Storage
- Automatic Key Expiration
- Rate Limiting
- Redis Counters
- Background Job Processing
- BullMQ
- Producer
- Consumer
- Queue
- Worker
- Asynchronous Processing
- Temporary Data Storage
- Redis Best Practices

---

# 👨‍💻 Author

**Sanchay Kumar Singh**

### Connect with Me

- GitHub: https://github.com/Sanchay-Kumar-Singh
- LinkedIn: https://www.linkedin.com/in/sanchay-kumar-singh

---

⭐ If this project helped you learn Redis, consider giving it a **Star** on GitHub!