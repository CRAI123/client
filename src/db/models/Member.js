// Member.js - 会员数据模型
import DatabaseConfig from '../config/DatabaseConfig.js';

class Member {
  constructor() {
    this.dbConfig = new DatabaseConfig();
    this.sql = null;
  }

  // 获取数据库连接
  async getConnection() {
    if (!this.sql) {
      const connectionResult = await this.dbConfig.createConnection();
      if (connectionResult.success) {
        this.sql = connectionResult.connection;
      } else {
        throw new Error(connectionResult.error);
      }
    }
    return this.sql;
  }

  // 创建会员表
  async createMemberTable() {
    try {
      const sql = await this.getConnection();
      await sql`
        CREATE TABLE IF NOT EXISTS members (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          vip_level VARCHAR(20) DEFAULT 'basic',
          vip_key VARCHAR(50),
          vip_activated_at TIMESTAMP,
          vip_expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP,
          is_active BOOLEAN DEFAULT true,
          profile_data JSONB DEFAULT '{}'
        )
      `;
      return { success: true, message: '会员表创建成功' };
    } catch (error) {
      console.error('创建会员表失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 创建会员
  async createMember(memberData) {
    try {
      const sql = await this.getConnection();
      const { username, email, passwordHash, vipLevel = 'basic' } = memberData;
      const result = await sql`
        INSERT INTO members (username, email, password_hash, vip_level)
        VALUES (${username}, ${email}, ${passwordHash}, ${vipLevel})
        RETURNING id, username, email, vip_level, created_at
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('创建会员失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 根据用户名获取会员
  async getMemberByUsername(username) {
    try {
      const sql = await this.getConnection();
      const result = await sql`
        SELECT * FROM members WHERE username = ${username} AND is_active = true
      `;
      return { success: true, data: result[0] || null };
    } catch (error) {
      console.error('获取会员信息失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 根据邮箱获取会员
  async getMemberByEmail(email) {
    try {
      const sql = await this.getConnection();
      const result = await sql`
        SELECT * FROM members WHERE email = ${email} AND is_active = true
      `;
      return { success: true, data: result[0] || null };
    } catch (error) {
      console.error('获取会员信息失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 激活VIP密钥
  async activateVipKey(memberId, vipKey, vipLevel, expiresAt) {
    try {
      const sql = await this.getConnection();
      const result = await sql`
        UPDATE members 
        SET vip_key = ${vipKey}, 
            vip_level = ${vipLevel}, 
            vip_activated_at = CURRENT_TIMESTAMP,
            vip_expires_at = ${expiresAt},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${memberId}
        RETURNING id, username, vip_level, vip_activated_at, vip_expires_at
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('激活VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 更新最后登录时间
  async updateLastLogin(memberId) {
    try {
      const sql = await this.getConnection();
      await sql`
        UPDATE members 
        SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${memberId}
      `;
      return { success: true };
    } catch (error) {
      console.error('更新登录时间失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取所有会员（管理员功能）
  async getAllMembers(limit = 50, offset = 0) {
    try {
      const sql = await this.getConnection();
      const result = await sql`
        SELECT id, username, email, vip_level, vip_activated_at, vip_expires_at, 
               created_at, last_login, is_active
        FROM members 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return { success: true, data: result };
    } catch (error) {
      console.error('获取会员列表失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 统计会员数量
  async getMemberStats() {
    try {
      const sql = await this.getConnection();
      const result = await sql`
        SELECT 
          COUNT(*) as total_members,
          COUNT(CASE WHEN vip_level != 'basic' THEN 1 END) as vip_members,
          COUNT(CASE WHEN last_login > CURRENT_TIMESTAMP - INTERVAL '30 days' THEN 1 END) as active_members
        FROM members
        WHERE is_active = true
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('获取会员统计失败:', error);
      return { success: false, error: error.message };
    }
  }
}

export default Member;