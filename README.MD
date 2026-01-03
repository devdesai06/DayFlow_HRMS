🚀 Dayflow HRMS
Dayflow HRMS is a full-stack Human Resource Management System designed to manage employees, attendance, leaves, payroll, and notifications in an organization.
The system follows a modern web architecture using React for frontend, Node.js with Express for backend APIs, and an SQL database for persistent storage.


🧱 Tech Stack
Frontend
React JS (Create React App)
React Router DOM
Context API for authentication state
Axios for API communication
Plain CSS for styling

Backend
Node.js
Express.js
RESTful API architecture
JWT-based authentication

Database
SQL (Relational Database)
Normalized schema with foreign key relationships


🎯 Project Objective
The main objective of Dayflow HRMS is to:
Provide role-based access for Employees and Admins
Centralize employee information
Track daily attendance
Manage leave requests and approvals
Maintain payroll records
Send system notifications
Follow clean and scalable architecture


📁 Project Structure Overview
Frontend (React)
├── auth/           → Login, Register, Verify Email, ProtectedRoute
├── components/     → Sidebar, Topbar, EmployeeCard
├── context/        → Authentication context
├── dashboard/      → Employee & Admin dashboards
├── layouts/        → Shared dashboard layout
├── pages/          → Admin pages, Employee pages, Profile pages
├── services/       → API abstraction layer
├── styles/         → Modular CSS files

Backend (Node + Express)
├── routes/         → Auth, Users, Employees, Attendance, Leaves, Payroll
├── controllers/    → Request handling logic
├── middleware/     → Auth & role checks
├── models/         → SQL query handlers


🔐 Authentication & Authorization
Users log in using email and password
JWT token is generated on successful login
Token is sent with every protected API request
Role-based authorization is enforced

Roles supported:
EMPLOYEE
ADMIN

🌐 API Routes Overview

Authentication Routes
POST /api/v1/auth/register
Register a new user

POST /api/v1/auth/login
Authenticate user and return token

POST /api/v1/auth/verify-email
Verify registered email

User Routes
GET /api/v1/users/me
Get logged-in user details

GET /api/v1/users
Get all users (Admin only)

PUT /api/v1/users/:id/status
Activate or deactivate user (Admin)

Employee Routes
GET /api/v1/employees/me
Get logged-in employee profile

GET /api/v1/employees
Get all employees (Admin)

GET /api/v1/employees/:id
Get employee profile by ID

PUT /api/v1/employees/:id
Update employee details

Attendance Routes
POST /api/v1/attendance/check-in
Employee check-in

POST /api/v1/attendance/check-out
Employee check-out

GET /api/v1/attendance/me
View own attendance

GET /api/v1/attendance
View all attendance (Admin)

GET /api/v1/attendance/:employeeId
View attendance of a specific employee

Leave Management Routes
GET /api/v1/leave-types
Get available leave types

POST /api/v1/leave-types
Create leave type (Admin)

POST /api/v1/leaves
Apply for leave

GET /api/v1/leaves/me
View own leave requests

GET /api/v1/leaves
View all leave requests (Admin)

GET /api/v1/leaves/:id
View leave request details

PUT /api/v1/leaves/:id/decision
Approve or reject leave (Admin)

Payroll Routes
GET /api/v1/payroll/me
View own payroll

GET /api/v1/payroll
View all payrolls (Admin)

POST /api/v1/payroll
Create payroll record

PUT /api/v1/payroll/:id
Update payroll record

Notifications Routes
GET /api/v1/notifications
Get user notifications

PUT /api/v1/notifications/:id/read
Mark notification as read


🧭 Application Flow (How It Works)
User logs in
    Backend validates credentials
    JWT token is generated
    Frontend stores token in context
    Protected routes become accessible
    Role determines dashboard view
    User interacts with HR modules
    Backend processes requests and updates database


📊 ER Diagram
![alt text](er.jpeg)

📊 ER Diagram Explanation

The ER diagram represents the relational structure of the HRMS database.

Users
    Stores login and authentication details
    Fields include email, password hash, role, and active status
    Linked to employees and notifications

Employees
    Stores employee personal and job details
    Linked to users using user_id
    Connected with attendance, leave requests, and payroll

Attendance
    Records daily check-in and check-out
    Linked to employees
    Tracks attendance status

Leave Types
    Defines types of leaves (paid or unpaid)
    Referenced in leave requests

Leave Requests
    Stores leave applications submitted by employees
    Includes date range, reason, status
    Reviewed by admins

Payroll
    Stores salary details of employees
    Includes base salary, allowances, deductions, net salary
    Linked to employees

Notifications
    Stores system notifications for users
    Tracks read/unread status


✨ Key Features
Role-based dashboards
Secure authentication
Attendance tracking
Leave management with approval flow
Payroll management
Notification system
Clean UI and modular code
Scalable REST API design


▶️ How to Run the Project
Frontend
    npm install
    npm start

Backend
    npm install
    npm run dev


🎓 Academic & Practical Value
This project demonstrates:
Full-stack web development
REST API design
SQL database modeling
Real-world HRMS workflows
Clean frontend architecture
