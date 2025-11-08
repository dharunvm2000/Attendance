# Attendance Tracker with Vercel Postgres

This is a weekly salary calculator and attendance tracker that uses Vercel Postgres for data persistence.

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set up Vercel Postgres Database

1. **Create a Vercel account** (if you don't have one):
   - Go to [vercel.com](https://vercel.com) and sign up

2. **Create a new Vercel project**:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in this directory to link your project
   - Or create a project through the Vercel dashboard

3. **Add Vercel Postgres**:
   - Go to your Vercel project dashboard
   - Navigate to the "Storage" tab
   - Click "Create Database" → Select "Postgres"
   - Give it a name (e.g., "attendance-db")
   - Note: Vercel will automatically set environment variables

4. **Run the database schema**:
   - Go to your Vercel project → Storage → Your Postgres database
   - Click on "Query" tab
   - Copy and paste the contents of `schema.sql`
   - Execute the SQL to create the tables

### Step 3: Environment Variables

Vercel automatically provides these environment variables when you add Postgres:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

These are automatically available in your Vercel functions.

### Step 4: Deploy to Vercel

```bash
vercel
```

Or push to GitHub and connect your repository to Vercel for automatic deployments.

### Step 5: Update API Base URL

After deployment, update the `API_BASE_URL` in `attendance.html` to your Vercel deployment URL, or use relative paths if hosting on the same domain.

## Local Development

To test locally:

```bash
vercel dev
```

This will start a local development server and use your Vercel environment variables.

## Project Structure

```
├── api/
│   ├── employees.js      # Employee CRUD operations
│   ├── attendance.js     # Attendance record operations
│   └── load-all.js      # Load all data endpoint
├── attendance.html      # Frontend application
├── schema.sql          # Database schema
├── package.json        # Dependencies
└── vercel.json        # Vercel configuration
```

## API Endpoints

- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `DELETE /api/employees?id={id}` - Delete employee

- `GET /api/attendance` - Get attendance records (supports query params)
- `POST /api/attendance` - Create/update attendance record
- `DELETE /api/attendance` - Delete attendance records

- `GET /api/load-all` - Load all employees with their records

## Notes

- The database uses UUIDs for primary keys
- Attendance records have a unique constraint on (employee_id, date)
- All timestamps are automatically managed
- The frontend automatically syncs with the database on load and save

