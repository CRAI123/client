// API 路由示例 - 在实际的Next.js项目中，这个文件应该放在 pages/api/ 或 app/api/ 目录下
// 这里仅作为示例代码参考

import { neon } from '@neondatabase/serverless';

// 浏览器兼容的密码哈希实现
// 注意：这是一个简化的实现，生产环境中应该使用服务器端bcrypt
const browserCrypto = {
  hash: async (password, rounds = 12) => {
    // 使用Web Crypto API进行哈希
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt_' + rounds);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `browser_hash_${rounds}_${hashHex}`;
  },
  compare: async (password, hash) => {
    if (!hash.startsWith('browser_hash_')) {
      return false;
    }
    const parts = hash.split('_');
    if (parts.length !== 4) return false;
    const rounds = parseInt(parts[2]);
    const expectedHash = await browserCrypto.hash(password, rounds);
    return hash === expectedHash;
  }
};

const bcrypt = browserCrypto;

// 获取数据库版本信息
async function getDatabaseVersion() {
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
async function createSampleTable() {
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
async function createContactTable() {
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
async function insertComment(comment) {
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
async function getComments() {
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
async function insertContactMessage(name, email, message) {
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
async function getContactMessages() {
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
async function updateContactMessageStatus(id, status) {
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
async function createUsersTable() {
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
async function checkUsernameExists(username) {
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
async function checkEmailExists(email) {
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

// 使用bcrypt进行密码哈希
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// 验证密码
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// 插入新用户
async function insertUser(username, email, password) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    const hashedPassword = await hashPassword(password);
    
    const result = await sql`
      INSERT INTO users (username, email, password_hash, created_at)
      VALUES (${username}, ${email}, ${hashedPassword}, NOW())
      RETURNING id, username, email, created_at, vip_status, vip_level
    `;
    
    return { success: true, user: result[0] };
  } catch (error) {
    console.error('插入用户失败:', error);
    if (error.message.includes('duplicate key')) {
      if (error.message.includes('username')) {
        return { success: false, error: '用户名已存在' };
      } else if (error.message.includes('email')) {
        return { success: false, error: '邮箱已被注册' };
      }
    }
    return { success: false, error: error.message };
  }
}

// 验证用户登录
async function validateUserLogin(username, password) {
  try {
    const sql = neon(process.env.REACT_APP_DATABASE_URL);
    
    // 首先获取用户的哈希密码
    const userResult = await sql`
      SELECT id, username, email, password_hash, created_at, vip_status, vip_level, vip_expires_at, avatar, signature
      FROM users 
      WHERE username = ${username} OR email = ${username}
    `;
    
    if (userResult.length === 0) {
      return { success: false, error: '用户名或密码错误' };
    }
    
    const user = userResult[0];
    
    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    
    if (isPasswordValid) {
      // 返回用户信息（不包含密码）
      const { password_hash: _, ...userWithoutPassword } = user;
      return { success: true, data: userWithoutPassword };
    } else {
      return { success: false, error: '用户名或密码错误' };
    }
  } catch (error) {
    console.error('验证用户登录失败:', error);
    return { success: false, error: error.message };
  }
}

// 导出所有函数
export {
  getDatabaseVersion,
  createSampleTable,
  createContactTable,
  insertComment,
  getComments,
  insertContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  createUsersTable,
  checkUsernameExists,
  checkEmailExists,
  insertUser,
  validateUserLogin,
  hashPassword,
  verifyPassword
};

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