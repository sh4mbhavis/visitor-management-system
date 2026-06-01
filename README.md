# Visitor Management System

## Overview

The Visitor Management System is a full-stack web application designed to streamline the process of visitor registration, approval, tracking, and management within an organization.

The system enables organizations to maintain visitor records, schedule visits, manage approvals, and monitor visitor activity efficiently through a centralized platform.

---

## Features

### Visitor Management

* Register new visitors
* View visitor details
* Update visitor information
* Delete visitor records

### Visit Management

* Schedule visits
* Track visit status
* Manage check-in and check-out
* View visit history

### Approval Workflow

* Create approval requests
* Approve or reject visits
* Track approval status

### Department Management

* Associate visitors with departments
* Manage department information

### User & Role Management

* Role-based access control
* User management
* Authorization support

---

## Technology Stack

### Backend

* ASP.NET Core 8
* C#
* Entity Framework Core
* SQL Server
* RESTful APIs

### Frontend

* Angular
* TypeScript
* HTML
* SCSS

### Database

* SQL Server

### Tools

* Visual Studio Code
* Git
* GitHub

---

## Project Structure

```text
backend/
├── VisitorManagement.Api
├── VisitorManagement.Application
├── VisitorManagement.Domain
└── VisitorManagement.Infrastructure

visitor-management-ui/
└── Angular Frontend
```

---

## API Endpoints

### Visitors

* GET /api/visitors
* GET /api/visitors/{id}
* POST /api/visitors
* PUT /api/visitors/{id}
* DELETE /api/visitors/{id}

### Visits

* GET /api/visits
* GET /api/visits/{id}
* POST /api/visits
* PUT /api/visits/{id}
* DELETE /api/visits/{id}

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/visitor-management-system.git
```

### Backend Setup

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

### Frontend Setup

```bash
cd visitor-management-ui
npm install
ng serve
```

### Database Setup

1. Create a SQL Server database.
2. Execute the `VisitorData.sql` script.
3. Update the connection string in `appsettings.json`.
4. Run the application.

---

## Future Enhancements

* JWT Authentication
* Email Notifications
* Visitor Photo Capture
* QR Code Based Check-In
* Dashboard & Analytics
* Audit Logging
* Reports Export

---

## Author

Developed by Sushant Shekhar as a full-stack learning and portfolio project using ASP.NET Core and Angular.
