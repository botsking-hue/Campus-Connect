import sql from '../../lib/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { campus, category, status, limit = 20 } = req.query;
      
      let query = sql`
        SELECT p.*, u.first_name, u.username 
        FROM posts p 
        LEFT JOIN users u ON p.user_id = u.user_id 
        WHERE 1=1
      `;
      
      if (campus && campus !== 'all') {
        query = query.append(sql` AND p.campus = ${campus}`);
      }
      
      if (category) {
        query = query.append(sql` AND p.category = ${category}`);
      }
      
      if (status) {
        query = query.append(sql` AND p.status = ${status}`);
      }
      
      query = query.append(sql` ORDER BY p.created_at DESC LIMIT ${limit}`);
      
      const posts = await query;
      res.json(posts);
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { user_id, campus, category, content, title, location, price, event_date } = req.body;
      
      const [post] = await sql`
        INSERT INTO posts (user_id, campus, category, title, content, location, price, event_date, status)
        VALUES (${user_id}, ${campus}, ${category}, ${title}, ${content}, ${location}, ${price}, ${event_date}, 'pending')
        RETURNING *
      `;
      
      res.json({ success: true, post, message: 'Post created successfully' });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
