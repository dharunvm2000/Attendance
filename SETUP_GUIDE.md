# Step-by-Step Setup Guide: Vercel Postgres Integration

This guide will walk you through setting up Vercel Postgres for your attendance tracker application.

## Prerequisites
- A Vercel account (sign up at [vercel.com](https://vercel.com) if needed)
- Node.js installed on your computer (for local development)

---

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install:
- `@vercel/postgres` - The Vercel Postgres client library
- `vercel` - Vercel CLI for deployment and local development

---

## Step 2: Create a Vercel Account and Project

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project to Vercel:
   ```bash
   vercel
   ```
   - Follow the prompts to create a new project
   - Choose your preferred settings

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your repository (if using Git) or upload your project

---

## Step 3: Add Vercel Postgres Database

1. **Go to your Vercel project dashboard**
   - Navigate to your project on vercel.com

2. **Open the Storage tab**
   - Click on "Storage" in the left sidebar
   - Or go to: `https://vercel.com/[your-username]/[your-project]/storage`

3. **Create a Postgres database**
   - Click "Create Database"
   - Select "Postgres"
   - Give it a name (e.g., "attendance-db")
   - Choose a region (closest to your users)
   - Click "Create"

4. **Note the environment variables**
   - Vercel automatically adds these to your project:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`
     - `POSTGRES_USER`
     - `POSTGRES_HOST`
     - `POSTGRES_PASSWORD`
     - `POSTGRES_DATABASE`
   - These are available in your API functions automatically

---

## Step 4: Set Up Database Schema

1. **Open the Vercel Postgres Query Editor**
   - In your Vercel project dashboard
   - Go to Storage → Your Postgres database
   - Click on the "Query" tab

2. **Run the schema SQL**
   - Open the `schema.sql` file in this project
   - Copy all the contents
   - Paste into the Vercel Query Editor
   - Click "Run" or press Ctrl+Enter

   This will create:
   - `employees` table - stores employee information
   - `attendance_records` table - stores daily attendance records
   - Indexes for faster queries

3. **Verify tables were created**
   - You should see success messages
   - You can verify by running:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

---

## Step 5: Deploy to Vercel

### Using Vercel CLI:

```bash
vercel --prod
```

### Using Git (Recommended for automatic deployments):

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel will automatically deploy on every push

---

## Step 6: Test Your Application

1. **Visit your deployed URL**
   - Vercel provides a URL like: `https://your-project.vercel.app`

2. **Test the functionality:**
   - Add an employee
   - Record attendance
   - Check if data persists after refresh

3. **Check for errors:**
   - Open browser console (F12)
   - Look for any API errors
   - Check Vercel function logs in the dashboard

---

## Step 7: Local Development (Optional)

To test locally with your Vercel Postgres database:

```bash
vercel dev
```

This will:
- Start a local development server
- Use your Vercel environment variables
- Allow you to test API endpoints locally

---

## Troubleshooting

### Issue: "Cannot connect to database"
- **Solution**: Make sure you've created the Postgres database in Vercel
- Check that environment variables are set in your Vercel project

### Issue: "Table does not exist"
- **Solution**: Run the `schema.sql` file in the Vercel Query Editor
- Verify tables exist: `SELECT * FROM employees LIMIT 1;`

### Issue: "CORS errors"
- **Solution**: The API routes already include CORS headers
- If issues persist, check that your frontend URL matches your API URL

### Issue: "API returns 500 error"
- **Solution**: 
  - Check Vercel function logs in the dashboard
  - Verify database connection string is correct
  - Ensure schema has been run

### Issue: "Data not persisting"
- **Solution**: 
  - Check browser console for errors
  - Verify API endpoints are being called
  - Check Vercel function logs

---

## Project Structure

```
├── api/
│   ├── employees.js      # Employee CRUD operations
│   ├── attendance.js     # Attendance record operations
│   └── load-all.js      # Load all data endpoint
├── attendance.html       # Frontend application
├── schema.sql           # Database schema
├── package.json         # Dependencies
├── vercel.json         # Vercel configuration
└── README.md           # Project documentation
```

---

## API Endpoints

Your application uses these API endpoints:

- **GET** `/api/employees` - Get all employees
- **POST** `/api/employees` - Create new employee
- **DELETE** `/api/employees?id={id}` - Delete employee

- **GET** `/api/attendance` - Get attendance records
- **POST** `/api/attendance` - Create/update attendance record
- **DELETE** `/api/attendance` - Delete attendance records

- **GET** `/api/load-all` - Load all employees with their records

---

## Next Steps

1. **Customize the application** to your needs
2. **Add authentication** if needed (Vercel supports Auth0, etc.)
3. **Set up monitoring** using Vercel Analytics
4. **Configure custom domain** in Vercel settings

---

## Support

If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Review browser console for frontend errors
3. Verify database connection and schema
4. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

---

**Congratulations!** Your attendance tracker is now using Vercel Postgres for data persistence! 🎉

