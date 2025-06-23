// API 路由示例 - 在实际的Next.js项目中，这个文件应该放在 pages/api/ 或 app/api/ 目录下
// 这里仅作为示例代码参考

import { neon } from '@neondatabase/serverless';

// 获取数据库版本信息
export async function getDatabaseVersion() {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const response = await sql`SELECT version()`;
    return {
      success: true,
      version: response[0].version
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 创建示例表
export async function createSampleTable() {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    return {
      success: true,
      message: 'Table created successfully'
    };
  } catch (error) {
    console.error('Create table error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 插入评论
export async function insertComment(comment) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      INSERT INTO comments (comment) 
      VALUES (${comment}) 
      RETURNING id, comment, created_at
    `;
    return {
      success: true,
      data: result[0]
    };
  } catch (error) {
    console.error('Insert comment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 获取所有评论
export async function getComments() {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      SELECT id, comment, created_at 
      FROM comments 
      ORDER BY created_at DESC
    `;
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Get comments error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Next.js API 路由处理函数示例
// 在实际项目中，这个函数应该在 pages/api/database.js 或 app/api/database/route.js 中
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await getDatabaseVersion();
    if (result.success) {
      res.status(200).json({ version: result.version });
    } else {
      res.status(500).json({ error: result.error });
    }
  } else if (req.method === 'POST') {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }
    
    // 确保表存在
    await createSampleTable();
    
    // 插入评论
    const result = await insertComment(comment);
    if (result.success) {
      res.status(201).json(result.data);
    } else {
      res.status(500).json({ error: result.error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}