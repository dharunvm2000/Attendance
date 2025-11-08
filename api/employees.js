import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all employees
      const result = await sql`
        SELECT id, name, salary, created_at, updated_at
        FROM employees
        ORDER BY name ASC
      `;
      
      res.status(200).json(result.rows);
    } 
    else if (req.method === 'POST') {
      // Create new employee
      const { name, salary } = req.body;
      
      if (!name || !salary || salary <= 0) {
        return res.status(400).json({ error: 'Name and valid salary are required' });
      }

      const result = await sql`
        INSERT INTO employees (name, salary)
        VALUES (${name}, ${salary})
        RETURNING id, name, salary, created_at, updated_at
      `;
      
      res.status(201).json(result.rows[0]);
    } 
    else if (req.method === 'DELETE') {
      // Delete employee
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Employee ID is required' });
      }

      await sql`
        DELETE FROM employees
        WHERE id = ${id}
      `;
      
      res.status(200).json({ message: 'Employee deleted successfully' });
    } 
    else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

