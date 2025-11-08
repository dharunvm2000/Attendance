import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get attendance records
      const { employee_id, date, start_date, end_date } = req.query;
      
      let query;
      if (employee_id && date) {
        // Get specific record
        query = sql`
          SELECT id, employee_id, date, attendance, mrng_ot, evng_ot, advance
          FROM attendance_records
          WHERE employee_id = ${employee_id} AND date = ${date}
        `;
      } else if (employee_id && start_date && end_date) {
        // Get records for employee in date range
        query = sql`
          SELECT id, employee_id, date, attendance, mrng_ot, evng_ot, advance
          FROM attendance_records
          WHERE employee_id = ${employee_id} 
            AND date >= ${start_date} 
            AND date <= ${end_date}
          ORDER BY date ASC
        `;
      } else if (employee_id) {
        // Get all records for employee
        query = sql`
          SELECT id, employee_id, date, attendance, mrng_ot, evng_ot, advance
          FROM attendance_records
          WHERE employee_id = ${employee_id}
          ORDER BY date DESC
        `;
      } else {
        // Get all records
        query = sql`
          SELECT id, employee_id, date, attendance, mrng_ot, evng_ot, advance
          FROM attendance_records
          ORDER BY date DESC, employee_id ASC
        `;
      }
      
      const result = await query;
      res.status(200).json(result.rows);
    } 
    else if (req.method === 'POST' || req.method === 'PUT') {
      // Create or update attendance record
      const { employee_id, date, attendance, mrng_ot, evng_ot, advance } = req.body;
      
      if (!employee_id || !date || !attendance) {
        return res.status(400).json({ error: 'Employee ID, date, and attendance are required' });
      }

      const result = await sql`
        INSERT INTO attendance_records (employee_id, date, attendance, mrng_ot, evng_ot, advance)
        VALUES (${employee_id}, ${date}, ${attendance}, ${mrng_ot || 0}, ${evng_ot || 0}, ${advance || 0})
        ON CONFLICT (employee_id, date)
        DO UPDATE SET
          attendance = EXCLUDED.attendance,
          mrng_ot = EXCLUDED.mrng_ot,
          evng_ot = EXCLUDED.evng_ot,
          advance = EXCLUDED.advance,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, employee_id, date, attendance, mrng_ot, evng_ot, advance
      `;
      
      res.status(200).json(result.rows[0]);
    } 
    else if (req.method === 'DELETE') {
      // Delete attendance records
      const { employee_id, date, start_date, end_date } = req.query;
      
      if (employee_id && start_date && end_date) {
        // Delete records for employee in date range (e.g., clear week)
        await sql`
          DELETE FROM attendance_records
          WHERE employee_id = ${employee_id}
            AND date >= ${start_date}
            AND date <= ${end_date}
        `;
        res.status(200).json({ message: 'Records deleted successfully' });
      } else if (employee_id && date) {
        // Delete specific record
        await sql`
          DELETE FROM attendance_records
          WHERE employee_id = ${employee_id} AND date = ${date}
        `;
        res.status(200).json({ message: 'Record deleted successfully' });
      } else {
        return res.status(400).json({ error: 'Invalid parameters for deletion' });
      }
    } 
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

