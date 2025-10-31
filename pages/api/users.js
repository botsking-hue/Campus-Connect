import sql from '../../lib/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;
      
      if (user_id) {
        const user = await sql`
          SELECT * FROM users WHERE user_id = ${user_id}
        `;
        return res.json(user[0] || {});
      }
      
      const users = await sql`
        SELECT * FROM users ORDER BY created_at DESC
      `;
      res.json(users);
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { user_id, username, first_name, campus } = req.body;
      
      await sql`
        INSERT INTO users (user_id, username, first_name, campus) 
        VALUES (${user_id}, ${username}, ${first_name}, ${campus})
        ON CONFLICT (user_id) DO UPDATE SET
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          campus = EXCLUDED.campus
      `;
      
      res.json({ success: true, message: 'User created/updated' });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
