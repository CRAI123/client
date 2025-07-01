const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
const sql = neon(process.env.DATABASE_URL);

// 简单的密码哈希函数（生产环境建议使用bcrypt）
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return hash.toString();
}

// 创建用户表
async function createUsersTable() {
  try {
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
    return { success: true };
  } catch (error) {
    console.error('Create users table error:', error);
    return { success: false, error: error.message };
  }
}

// API路由

// 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: '请填写所有字段' });
    }
    
    // 确保用户表存在
    await createUsersTable();
    
    // 检查用户名是否已存在
    const existingUsername = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    if (existingUsername.length > 0) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }
    
    // 检查邮箱是否已存在
    const existingEmail = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: '邮箱已被注册' });
    }
    
    // 哈希密码
    const passwordHash = hashPassword(password);
    
    // 插入新用户
    const result = await sql`
      INSERT INTO users (username, email, password_hash) 
      VALUES (${username}, ${email}, ${passwordHash}) 
      RETURNING id, username, email, created_at, vip_status, vip_level
    `;
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: '注册失败，请稍后重试' });
  }
});

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '请填写用户名和密码' });
    }
    
    // 哈希密码
    const passwordHash = hashPassword(password);
    
    // 验证用户
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
      
      res.json({ success: true, data: result[0] });
    } else {
      res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: '登录失败，请稍后重试' });
  }
});

// 检查用户名是否存在
app.get('/api/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;
    res.json({ success: true, exists: result.length > 0 });
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 检查邮箱是否存在
app.get('/api/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    res.json({ success: true, exists: result.length > 0 });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`API地址: http://localhost:${PORT}/api`);
});

module.exports = app;