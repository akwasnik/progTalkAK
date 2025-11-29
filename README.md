# ProgTalk – Full-Stack Discussion Platform

ProgTalk is a full‑stack web application designed as a modern discussion and knowledge‑sharing platform.  
It showcases practical use of **Node.js, Express, MongoDB, Socket.IO, Vue.js 3, JWT, Passport.js, and Docker**, implemented in a clean **domain‑driven, modular architecture**.  

The project simulates a real production system with fully separated backend and frontend, authentication flow, role management, real‑time communication, and a structured content hierarchy.

---

## 🚀 Tech Stack Overview

### **Backend**
- **Node.js (Express)** – REST API built using modular / domain‑driven architecture  
- **MongoDB** – NoSQL document database  
- **Mongoose** – ODM layer  
- **Passport.js + JWT** – authentication & sessionless authorization  
- **Socket.IO** – real‑time global chat between users  
- **Docker** – containerized backend & database  
- **Highlight.js** – code highlighting inside posts  
- **BCrypt** – password hashing  
- **Joi / Validator** – request validation  
- **Winston logger** – structured backend logs  

---

## 🎨 Frontend
- **Vue.js 3 (Composition API)**  
- **Pinia** – global state management  
- **Vue Router** – SPA routing  
- **Highlight.js** – syntax highlighting in post editor  
- **Axios** – API communication  
- **Vite** – development server & bundler  

---

## 🗂 Domain‑Driven Architecture (DDD)
The backend is split into independent domains:

- **Users** – authentication, registration, roles (Admin, User, Moderator)  
- **Topics** – main categories  
- **Subtopics** – nested inside topics  
- **Posts** – content inside subtopics  
- **Tags** – tagging system for posts  
- **Chat** – global real‑time messaging via Socket.IO  

Each module contains:
```
model • service • repository • controller • routes
```

---

## 🔐 Authentication System
- JWT‑based stateless authentication  
- Login, register, refresh token flow  
- Role levels:
  - **Admin** – full management  
  - **Moderator** – can delete posts  
  - **User** – standard participant  

---

## 💬 Real‑Time Global Chat
- Powered by Socket.IO  
- Every logged‑in user shares one global chat room  
- Messages stored in MongoDB with timestamps  

---

## 🐳 Docker Infrastructure
`docker-compose.yml` includes:
- **Backend container** (Node.js)
- **MongoDB container** (database: `progtalk`)
- **Network + volumes** for persistence  

---

## ⭐ Why This Project Is Valuable for Recruiters
- Demonstrates ability to build **full production‑style systems**  
- Shows expertise in:
  - backend architecture  
  - database design  
  - API development  
  - frontend SPA development  
  - authentication & sessions  
  - real‑time communication  
  - Dockerization  
- Clean modular code, scalable structure, follows industry standards  
- Suitable for portfolio as a full‑stack engineering example  

---

## 📜 License
MIT License – free to use, modify, and learn from.

---

## 👤 Author
45x45 – Full‑stack developer • Node.js • Vue.js • System architecture

