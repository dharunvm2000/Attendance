import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all employees with their attendance records
    const employees = await sql`
      SELECT id, name, salary, created_at, updated_at
      FROM employees
      ORDER BY name ASC
    `;

    const records = await sql`
      SELECT id, employee_id, date, attendance, mrng_ot, evng_ot, advance
      FROM attendance_records
      ORDER BY date DESC
    `;

    // Group records by employee
    const employeesWithRecords = employees.rows.map(emp => ({
      id: emp.id,
      name: emp.name,
      salary: parseFloat(emp.salary),
      records: {}
    }));

    records.rows.forEach(record => {
      const employee = employeesWithRecords.find(emp => emp.id === record.employee_id);
      if (employee) {
        employee.records[record.date] = {
          attendance: record.attendance,
          mrngOt: parseFloat(record.mrng_ot || 0),
          evngOt: parseFloat(record.evng_ot || 0),
          advance: parseFloat(record.advance || 0)
        };
      }
    });

    res.status(200).json(employeesWithRecords);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

