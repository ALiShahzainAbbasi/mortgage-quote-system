# Mortgage System

A modern mortgage management system built with React, TypeScript, and Vite. Backend integrated via PHP and database MySQL.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Project Structure

```
mortgage-system/
├── frontend-next/           # Frontend application
├── backend/                 # Backend server
└── database/               # Database files and migrations
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone [repository-url]
cd mortgage-quote-system
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend-next/rose-brokers-quote-system
npm install
```

### 3. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 4. Database Setup

1. Ensure your database server is running
2. Navigate to the database directory
3. Run the database migrations:
   ```bash
   cd database
   [database-specific commands for migrations]
   ```

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend-next/rose-brokers-quote-system
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Production Build

1. Build the frontend:
   ```bash
   cd frontend-next/rose-brokers-quote-system
   npm run build
   ```

2. Start the production server:
   ```bash
   cd backend
   npm start
   ```

### Testing Functionalities

1. **User Authentication**
   - Try logging in with different user roles
   - Test password reset functionality
   - Verify session management

2. **Customer Features**
   - Submit mortgage applications
   - View application status
   - Upload required documents
   - Track application progress

3. **Broker Features**
   - View customer applications
   - Process applications
   - Generate quotes
   - Manage customer documents

4. **Quote Management**
   - Create new quotes
   - Modify existing quotes
   - Send quotes to customers
   - Track quote status

## Common Issues and Troubleshooting

1. **Port Conflicts**
   - If port 5173 is in use, Vite will automatically try the next available port
   - Check the terminal output for the correct URL

2. **Database Connection Issues**
   - Verify database server is running
   - Check database credentials in configuration
   - Ensure all migrations are up to date

3. **Build Errors**
   - Clear node_modules and package-lock.json
   - Run `npm install` again
   - Check for TypeScript errors in the console

## Support

For technical support or questions, please contact:
- Email: alishahzain123@gmail.com

## Security Notes

- All passwords are hashed using bcrypt
- API endpoints are protected with JWT authentication
- Sensitive data is encrypted at rest
- Regular security audits are performed

