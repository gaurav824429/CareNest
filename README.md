# CareNest — Elder Companionship Platform

> **Care That Connects Hearts.**

CareNest connects busy working professionals and families with trusted, vetted companions who support their elderly parents through meaningful conversation, daily assistance, walks, errands, and special occasion celebrations.

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router, Axios
- **Backend:** Spring Boot 3.3.5 (Java 21), Spring Security, JWT (`jjwt`), Spring Data JPA
- **Database:** MySQL 8.0

## Project Structure
```
Venture/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/carenest/
│       │   ├── config/DataSeeder.java
│       │   ├── controller/ (Auth, Public, Family, Companion, Admin)
│       │   ├── dto/ (AuthDtos, BookingDtos)
│       │   ├── entity/ (User, ElderProfile, CompanionProfile, ServiceCategory, Booking, VisitUpdate, ContactMessage)
│       │   ├── exception/GlobalExceptionHandler.java
│       │   ├── repository/
│       │   └── security/ (JwtUtil, JwtAuthenticationFilter, CustomUserDetailsService, SecurityConfig)
│       └── main/resources/application.yml
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── api/client.js
        ├── components/ (Navbar, Footer, DashboardLayout, ProtectedRoute, StatusBadge, ConfirmDialog)
        ├── context/AuthContext.jsx
        └── pages/
            ├── public/ (Landing, About, Services, HowItWorks, Contact, Login, Register)
            ├── family/ (Dashboard, ElderProfiles, FindCompanions, CompanionDetails, BookService, MyBookings, SpecialOccasions, FamilyProfile)
            ├── companion/ (Dashboard, CompanionProfile, BookingRequests, Schedule, CompletedVisits)
            └── admin/ (Dashboard, Users, Companions, Bookings, Services)
```

## Database Configuration (MySQL)
The backend automatically creates the `carenest` database if it does not exist and seeds realistic sample data on first startup.

Default settings in `backend/src/main/resources/application.yml`:
- `DB_URL`: `jdbc:mysql://localhost:3306/carenest?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- `DB_USERNAME`: `root` (override via `DB_USERNAME` env var)
- `DB_PASSWORD`: `root` (override via `DB_PASSWORD` env var)

## Running the Application

### 1. Start Backend
```bash
cd backend
# Set your MySQL password if different from "root":
# $env:DB_PASSWORD="your_mysql_password"
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`.

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Demo Login Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Family Member** | `ananya@carenest.com` | `Family@123` |
| **Companion** | `meera@carenest.com` | `Companion@123` |
| **Admin** | `admin@carenest.com` | `Admin@123` |
