import sql from '../../lib/database';

export default async function handler(req, res) {
  // Basic admin authentication
  const { user_id } = req.query;
  
  if (!user_id) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Check if user is admin
  const [user] = await sql`
    SELECT is_admin FROM users WHERE user_id = ${user_id}
  `;
  
  if (!user?.is_admin && user_id !== process.env.MAIN_ADMIN_ID) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  if (req.method === 'GET') {
    try {
      // Get admin stats
      const [stats] = await sql`
        SELECT 
          COUNT(*) as total_users,
          (SELECT COUNT(*) FROM posts) as total_posts,
          (SELECT COUNT(*) FROM posts WHERE status = 'pending') as pending_posts,
          COUNT(DISTINCT campus) as active_campuses
        FROM users
        WHERE campus IS NOT NULL
      `;
      
      // Get posts by category
      const categories = await sql`
        SELECT category, COUNT(*) as count 
        FROM posts 
        GROUP BY category
      `;
      
      res.json({ stats, categories });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { action, post_id } = req.body;
      
      if (action === 'approve') {
        await sql`
          UPDATE posts 
          SET status = 'approved', approved_at = NOW() 
          WHERE id = ${post_id}
        `;
        res.json({ success: true, message: 'Post approved' });
      }
      else if (action === 'reject') {
        await sql`
          DELETE FROM posts WHERE id = ${post_id}
        `;
        res.json({ success: true, message: 'Post rejected' });
      }
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
