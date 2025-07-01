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

// 创建联系消息表
export async function createContactTable() {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'unread'
      )
    `;
    return {
      success: true,
      message: 'Contact table created successfully'
    };
  } catch (error) {
    console.error('Create contact table error:', error);
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

// 插入联系消息
export async function insertContactMessage(name, email, message) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      INSERT INTO contact_messages (name, email, message) 
      VALUES (${name}, ${email}, ${message}) 
      RETURNING id, name, email, message, created_at, status
    `;
    return {
      success: true,
      data: result[0]
    };
  } catch (error) {
    console.error('Insert contact message error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 获取所有联系消息
export async function getContactMessages() {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      SELECT id, name, email, message, created_at, status 
      FROM contact_messages 
      ORDER BY created_at DESC
    `;
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Get contact messages error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 更新联系消息状态
export async function updateContactMessageStatus(id, status) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      UPDATE contact_messages 
      SET status = ${status} 
      WHERE id = ${id} 
      RETURNING id, name, email, message, created_at, status
    `;
    return {
      success: true,
      data: result[0]
    };
  } catch (error) {
    console.error('Update contact message status error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 创建用户表
export async function createUsersTable() {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        vip_status BOOLEAN DEFAULT FALSE,
        vip_level VARCHAR(50) DEFAULT 'basic',
        vip_expires_at TIMESTAMP NULL,
        avatar TEXT NULL,
        signature TEXT NULL,
        last_login TIMESTAMP NULL
      )
    `;
    return {
      success: true,
      message: 'Users table created successfully'
    };
  } catch (error) {
    console.error('Create users table error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 检查用户名是否存在
export async function checkUsernameExists(username) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    return {
      success: true,
      exists: result.length > 0
    };
  } catch (error) {
    console.error('Check username error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 检查邮箱是否存在
export async function checkEmailExists(email) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    return {
      success: true,
      exists: result.length > 0
    };
  } catch (error) {
    console.error('Check email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 插入新用户
export async function insertUser(username, email, passwordHash) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      INSERT INTO users (username, email, password_hash) 
      VALUES (${username}, ${email}, ${passwordHash}) 
      RETURNING id, username, email, created_at, vip_status, vip_level
    `;
    return {
      success: true,
      data: result[0]
    };
  } catch (error) {
    console.error('Insert user error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 验证用户登录
export async function validateUserLogin(username, passwordHash) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const result = await sql`
      SELECT id, username, email, created_at, vip_status, vip_level, vip_expires_at, avatar, signature
      FROM users 
      WHERE username = ${username} AND password_hash = ${passwordHash}
    `;
    
    if (result.length > 0) {
      // 更新最后登录时间
      await sql`
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = ${result[0].id}
      `;
      
      return {
        success: true,
        data: result[0]
      };
    } else {
      return {
        success: false,
        message: '用户名或密码错误'
      };
    }
  } catch (error) {
    console.error('Validate user login error:', error);
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
    const { type, comment, name, email, message } = req.body;
    
    if (type === 'contact') {
      // 处理联系消息
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email and message are required' });
      }
      
      // 确保联系消息表存在
      await createContactTable();
      
      // 插入联系消息
      const result = await insertContactMessage(name, email, message);
      if (result.success) {
        res.status(201).json(result.data);
      } else {
        res.status(500).json({ error: result.error });
      }
    } else {
      // 处理评论
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
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}