# Task Manager Web App  
**Developer:** W.M. Prabodha Shashini  
**Task Type:** Web Development Task – Synexis Internship  

---

## 📝 Overview
This is a **Task Manager Web Application** built for the Synexis Software Engineering Internship Web Task.  
The app allows users to manage tasks efficiently — add, edit, delete, assign, and track completion status.

---

## 🚀 Features
- View all tasks with filtering by stage (Not Started / In Progress / Completed)  
- Add and edit tasks with validation  
- Assign tasks to registered users  
- Delete tasks  
- Mark tasks as completed  
- Manage users (add/delete team members)  
- RESTful API integration between frontend and backend  
- MongoDB used as the database (for simplicity and efficiency)  
- Error handling and validation for clean UX  

---

## 🧩 Tech Stack
### Frontend
- React + TypeScript  
- Axios for API requests  
- Vite build tool  
- FontAwesome + React Icons for UI  
- TailwindCSS (optional styling)

### Backend
- Node.js + Express.js  
- MongoDB + Mongoose ORM  
- REST API with CRUD operations  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/WMPShashini/Task-Manager-App-Prabodha.git
cd Task-Manager-App

### 2. backend Setup
cd backend
npm install
npm run dev

### 3. frontend Setup
cd frontend
npm install
npm run dev

### 4.For React Icons (used in Login.tsx)
npm install react-icons

### 5.For Font Awesome (used in Sidebar.tsx)
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
