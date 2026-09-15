# ClassTaskSpace-v2 🎓

ClassTaskSpace-v2 is a modern **MERN Stack classroom management platform** designed to simplify the way teachers and students manage assignments, submissions, grading, and academic communication.

This version uses the same core classroom-management backend functionality as ClassTaskSpace, while introducing a **completely redesigned, AI-assisted frontend interface** with a more modern and visually polished user experience.

> **Learning Project:** This project was built to strengthen practical skills in MERN Stack development, authentication, file handling, cloud services, email automation, API integration, and modern frontend UI development.

---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration with email and password
* Email OTP verification
* Secure password hashing using bcrypt
* JWT-based authentication
* Google OAuth authentication
* Teacher and Student role selection
* Protected routes
* Role-based access control
* Complete profile setup for Google users when required

### 👨‍🏫 Teacher Features

* Create and manage classes
* Generate unique class join codes
* Post assignments with descriptions and deadlines
* Upload assignment PDFs
* View students enrolled in a class
* Track submitted and non-submitted students
* View student submissions
* Grade student assignments
* Assign marks
* Export submission records as CSV
* Receive submission notifications

### 👨‍🎓 Student Features

* Join classes using a unique class code
* View enrolled classes
* View assignments and deadlines
* Download assignment PDFs
* Submit assignment PDFs
* Resubmit assignments when required
* View submission status
* View grades and marks
* Get deadline and assignment notifications

### 📧 Automated Email Notifications

The system automatically sends emails for important classroom events, including:

* New assignment posted
* Assignment submission received
* Marks assigned
* Upcoming assignment deadline
* Deadline passed

A scheduled background job checks assignment deadlines and handles automated notifications.

### 📁 Cloud File Storage

* Assignment and submission PDFs are uploaded to **Cloudinary**
* Files are stored externally instead of consuming server storage
* Cloudinary URLs are used for downloading and accessing documents

### 📊 CSV Reports

Teachers can export assignment submission information as CSV files, including:

* Student name
* Student email
* Submission status
* Submission information

### 🔎 Search & Filtering

* Search classes
* Search assignments
* Filter classroom and assignment information for easier navigation

### 🎨 Modern UI

* Redesigned frontend interface
* Responsive layouts
* Modern dashboard experience
* Teacher and student specific interfaces
* Component-based React architecture
* Tailwind CSS styling

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **Vite**
* **Tailwind CSS**
* **React Router**
* **Axios**
* **Google Identity Services**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcryptjs**
* **Multer**

### Cloud & Services

* **MongoDB Atlas** — Database
* **Cloudinary** — PDF/file storage
* **Brevo** — Transactional email service
* **Google OAuth** — Authentication
* **Node-Cron** — Scheduled deadline checking

---

## 📁 Project Structure

```text
ClassTaskSpace-v2/
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── mailer.js
│   │
│   ├── controllers/
│   │   ├── assignmentController.js
│   │   ├── authController.js
│   │   ├── classController.js
│   │   └── submissionController.js
│   │
│   ├── cron/
│   │   └── assignmentDeadlineCron.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── role.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Assignment.js
│   │   ├── Class.js
│   │   ├── EmailVerification.js
│   │   ├── Submission.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── assignmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── classRoutes.js
│   │   └── submissionRoutes.js
│   │
│   ├── utils/
│   │   └── deadlineChecker.js
│   │
│   ├── package.json
│   └── server.js
│
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   │
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* **Node.js**
* **npm**
* **MongoDB Atlas account**
* **Cloudinary account**
* **Brevo account**
* **Google Cloud project** for OAuth

---

### Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

### Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | `/api/auth/register`   | Register a new user     |
| POST   | `/api/auth/login`      | Login user              |
| POST   | `/api/auth/verify-otp` | Verify email OTP        |
| POST   | `/api/auth/resend-otp` | Resend verification OTP |
| POST   | `/api/auth/google`     | Google authentication   |

### Classes

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/api/classes`      | Create a class     |
| GET    | `/api/classes`      | Get user's classes |
| POST   | `/api/classes/join` | Join a class       |
| GET    | `/api/classes/:id`  | Get class details  |

### Assignments

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | `/api/assignments`     | Create an assignment   |
| GET    | `/api/assignments/:id` | Get assignment details |
| PUT    | `/api/assignments/:id` | Update assignment      |
| DELETE | `/api/assignments/:id` | Delete assignment      |

### Submissions

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| POST   | `/api/submissions`           | Submit assignment   |
| PUT    | `/api/submissions/:id`       | Resubmit assignment |
| GET    | `/api/submissions/:id`       | Get submission      |
| PUT    | `/api/submissions/:id/grade` | Grade submission    |

> **Note:** Protected endpoints require a valid JWT authentication token.

---

## 🔐 Security

The application implements several security mechanisms:

* Password hashing with **bcryptjs**
* JWT-based authentication
* Protected API routes
* Role-based authorization
* Email OTP verification
* OTP expiration
* Failed OTP attempt limits
* OTP resend cooldown
* Environment variables for sensitive configuration
* Cloudinary-based external file storage

Sensitive credentials such as MongoDB passwords, Cloudinary secrets, Brevo API keys, and JWT secrets should **never be committed to GitHub**.

---

## 📧 Email Automation

ClassTaskSpace-v2 uses **Brevo** for transactional email delivery.

Automated emails are sent for:

```text
New Assignment
       ↓
Student receives notification

Student Submission
       ↓
Teacher receives notification

Teacher Grades Assignment
       ↓
Student receives marks notification

Deadline Approaching
       ↓
Reminder email

Deadline Passed
       ↓
Deadline notification
```

A scheduled cron process periodically checks assignment deadlines and triggers the required notifications.

---

## ☁️ File Storage

Assignment and submission PDFs are handled using **Cloudinary**.

```text
React Client
     ↓
Express API
     ↓
Multer
     ↓
Cloudinary
     ↓
Secure Cloud File URL
```

This avoids storing uploaded documents directly on the application server.

---

## 👥 User Roles

The application has two primary roles:

| Role          | Main Responsibilities                                                              |
| ------------- | ---------------------------------------------------------------------------------- |
| 👨‍🏫 Teacher | Create classes, post assignments, view submissions, grade students, export reports |
| 👨‍🎓 Student | Join classes, view assignments, submit work, resubmit work, view grades            |

Role-based middleware ensures that users can only access operations allowed for their role.

---

## 📊 Assignment Workflow

```text
Teacher
   │
   ├── Creates Class
   │
   ├── Posts Assignment
   │
   └── Uploads Assignment PDF
            │
            ▼
        Students
            │
            ├── View Assignment
            ├── Download PDF
            └── Submit Work
                    │
                    ▼
                 Teacher
                    │
                    ├── View Submission
                    ├── Grade
                    └── Export CSV
                            │
                            ▼
                         Student
                            │
                            └── View Marks
```

---

## 📝 Project Notes

ClassTaskSpace-v2 was developed as a redesigned version of the original ClassTaskSpace project.

The primary goal of this version was to experiment with:

* AI-assisted frontend design
* Modern React UI development
* MERN Stack architecture
* REST API integration
* Authentication and authorization
* Cloud-based file handling
* Automated email notifications
* Production deployment
* Docker-based backend deployment

The backend architecture and classroom functionality remain focused on the same academic workflow, while the frontend provides a refreshed user experience.

---

## 🚀 Future Enhancements

Possible future improvements include:

* Real-time notifications
* Assignment comments and discussions
* In-app notification center
* Student performance analytics
* Teacher analytics dashboard
* Calendar integration
* Pagination for large classes
* More advanced search and filtering
* Dockerized backend deployment
* CI/CD pipeline
* Improved mobile experience

---

## 🌐 Live Demo

**ClassTaskSpace-v2**

> Live deployment will be added after production deployment.

---

## 👤 Author

**Vishal Khade**

B.Tech Information Technology Student

GitHub: **[@vishalkhade25](https://github.com/vishalkhade25)**

---

⭐ If you find this project useful, consider giving the repository a star!
