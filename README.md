# ClinicMS

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [User Guide](#user-guide)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Using the Application](#using-the-application)

## Introduction
ClinicMS is a comprehensive **Clinic Management System** designed to streamline patient management, appointment scheduling, and medical record tracking. Built with modern web technologies, it offers multi-user access, real-time insights, and an intuitive user interface. [**Link Here**](https://clinicms-puce.vercel.app/)

## Features
- **Multi-User Access**: Role-based authentication for doctors, receptionists, and administrators.
- **Patient Registration**: Add and manage patient profiles with medical history.
- **Appointment Scheduling**: Book and manage patient appointments with reminders.
- **Checkup Records**: Store and review patient checkup history.
- **Statistical Insights**: Visualize patient visits using **Apex Charts**.
- **Secure & Scalable**: Built with **Next.js 15, PostgreSQL (Prisma ORM), and Server Actions**.
- **Modern UI**: Styled with **TailwindCSS and ShadCN** for a seamless user experience.

## Technologies Used
- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, ShadCN
- **Backend**: Server Actions, Prisma ORM, PostgreSQL
- **Charts & Visualizations**: Apex Charts
- **Deployment**: Vercel

## Getting Started
To set up **ClinicMS** locally, follow the instructions below.

## User Guide

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/clinicms.git
   cd clinicms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure your database:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/clinicms
   NEXTAUTH_SECRET=your_secret_key
   ```

4. **Set up the database**:
   ```bash
   npx prisma migrate dev --name init
   ```

### Running the Application
1. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
2. Open your browser and visit: `http://localhost:3000`

### Using the Application
1. **Register/Login**: Create an admin account and log in.
2. **Manage Patients**: Add and update patient records.
3. **Schedule Appointments**: Book and view upcoming appointments.
4. **View Insights**: Navigate to the dashboard to analyze patient visit trends.

## License
This project is licensed under the [MIT License](LICENSE).

