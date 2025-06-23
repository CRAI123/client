// VipKey.js - VIP密钥数据模型
import { neon } from '@neondatabase/serverless';
import DatabaseConfig from '../config/DatabaseConfig.js';

class VipKey {
  constructor() {
    this.dbConfig = new DatabaseConfig();
    this.sql = null;
    this.initializeConnection();
  }

  // 初始化数据库连接
  initializeConnection() {
    try {
      const config = this.dbConfig.getConnectionConfig();
      if (config.success) {
        this.sql = neon(config.connectionString);
      } else {
        console.warn('VipKey模型: 数据库连接配置失败:', config.error);
        throw new Error(config.error);
      }
    } catch (error) {
      console.error('VipKey模型: 初始化连接失败:', error);
      throw error;
    }
  }

  // 创建VIP密钥表
  async createVipKeyTable() {
    try {
      await this.sql`
        CREATE TABLE IF NOT EXISTS vip_keys (
          id SERIAL PRIMARY KEY,
          key_code VARCHAR(50) UNIQUE NOT NULL,
          key_type VARCHAR(20) DEFAULT 'temporary', -- 'permanent', 'temporary', 'trial'
          vip_level VARCHAR(20) DEFAULT 'premium', -- 'premium', 'gold', 'diamond'
          status VARCHAR(20) DEFAULT 'active', -- 'active', 'used', 'expired', 'disabled'
          max_usage_count INTEGER DEFAULT 1, -- 最大使用次数，-1表示无限制
          current_usage_count INTEGER DEFAULT 0, -- 当前使用次数
          expires_at TIMESTAMP, -- 密钥过期时间
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by VARCHAR(50), -- 创建者
          used_by_member_id INTEGER, -- 使用者会员ID
          first_used_at TIMESTAMP, -- 首次使用时间
          last_used_at TIMESTAMP, -- 最后使用时间
          description TEXT, -- 密钥描述
          metadata JSONB DEFAULT '{}' -- 额外元数据
        )
      `;
      
      // 创建索引
      await this.sql`CREATE INDEX IF NOT EXISTS idx_vip_keys_code ON vip_keys(key_code)`;
      await this.sql`CREATE INDEX IF NOT EXISTS idx_vip_keys_status ON vip_keys(status)`;
      await this.sql`CREATE INDEX IF NOT EXISTS idx_vip_keys_type ON vip_keys(key_type)`;
      
      return { success: true, message: 'VIP密钥表创建成功' };
    } catch (error) {
      console.error('创建VIP密钥表失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 生成VIP密钥
  generateKeyCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 创建VIP密钥
  async createVipKey(keyData) {
    try {
      const {
        keyCode = this.generateKeyCode(),
        keyType = 'temporary',
        vipLevel = 'premium',
        maxUsageCount = 1,
        expiresAt = null,
        createdBy = 'system',
        description = ''
      } = keyData;

      const result = await this.sql`
        INSERT INTO vip_keys (
          key_code, key_type, vip_level, max_usage_count, 
          expires_at, created_by, description
        )
        VALUES (
          ${keyCode}, ${keyType}, ${vipLevel}, ${maxUsageCount},
          ${expiresAt}, ${createdBy}, ${description}
        )
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('创建VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 批量创建VIP密钥
  async createBatchVipKeys(count, keyData) {
    try {
      const keys = [];
      for (let i = 0; i < count; i++) {
        const keyCode = this.generateKeyCode();
        keys.push({
          ...keyData,
          keyCode
        });
      }

      const results = [];
      for (const key of keys) {
        const result = await this.createVipKey(key);
        if (result.success) {
          results.push(result.data);
        }
      }

      return { success: true, data: results };
    } catch (error) {
      console.error('批量创建VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 验证VIP密钥
  async validateVipKey(keyCode) {
    try {
      const result = await this.sql`
        SELECT * FROM vip_keys 
        WHERE key_code = ${keyCode}
      `;

      if (result.length === 0) {
        return { success: false, error: '密钥不存在' };
      }

      const key = result[0];

      // 检查密钥状态
      if (key.status === 'disabled') {
        return { success: false, error: '密钥已被禁用' };
      }

      if (key.status === 'expired') {
        return { success: false, error: '密钥已过期' };
      }

      // 检查过期时间
      if (key.expires_at && new Date(key.expires_at) < new Date()) {
        await this.sql`
          UPDATE vip_keys SET status = 'expired' WHERE id = ${key.id}
        `;
        return { success: false, error: '密钥已过期' };
      }

      // 检查使用次数
      if (key.max_usage_count !== -1 && key.current_usage_count >= key.max_usage_count) {
        return { success: false, error: '密钥使用次数已达上限' };
      }

      return { success: true, data: key };
    } catch (error) {
      console.error('验证VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 使用VIP密钥
  async useVipKey(keyCode, memberId) {
    try {
      // 先验证密钥
      const validation = await this.validateVipKey(keyCode);
      if (!validation.success) {
        return validation;
      }

      const key = validation.data;
      const now = new Date();
      const newUsageCount = key.current_usage_count + 1;
      
      // 更新密钥使用信息
      let updateQuery = `
        UPDATE vip_keys 
        SET current_usage_count = ${newUsageCount},
            last_used_at = CURRENT_TIMESTAMP,
            used_by_member_id = ${memberId}
      `;

      // 如果是首次使用
      if (key.current_usage_count === 0) {
        updateQuery += `, first_used_at = CURRENT_TIMESTAMP`;
      }

      // 如果达到最大使用次数，标记为已使用
      if (key.max_usage_count !== -1 && newUsageCount >= key.max_usage_count) {
        updateQuery += `, status = 'used'`;
      }

      updateQuery += ` WHERE id = ${key.id} RETURNING *`;

      const result = await this.sql.unsafe(updateQuery);
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('使用VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取VIP密钥列表
  async getVipKeys(filters = {}) {
    try {
      const { status, keyType, limit = 50, offset = 0 } = filters;
      
      let query = 'SELECT * FROM vip_keys WHERE 1=1';
      const params = [];
      
      if (status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(status);
      }
      
      if (keyType) {
        query += ` AND key_type = $${params.length + 1}`;
        params.push(keyType);
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const result = await this.sql.unsafe(query, params);
      return { success: true, data: result };
    } catch (error) {
      console.error('获取VIP密钥列表失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取VIP密钥统计
  async getVipKeyStats() {
    try {
      const result = await this.sql`
        SELECT 
          COUNT(*) as total_keys,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_keys,
          COUNT(CASE WHEN status = 'used' THEN 1 END) as used_keys,
          COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_keys,
          COUNT(CASE WHEN key_type = 'permanent' THEN 1 END) as permanent_keys,
          COUNT(CASE WHEN key_type = 'temporary' THEN 1 END) as temporary_keys
        FROM vip_keys
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('获取VIP密钥统计失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 禁用VIP密钥
  async disableVipKey(keyId) {
    try {
      const result = await this.sql`
        UPDATE vip_keys 
        SET status = 'disabled' 
        WHERE id = ${keyId}
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('禁用VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 重新激活VIP密钥
  async reactivateVipKey(keyId) {
    try {
      const result = await this.sql`
        UPDATE vip_keys 
        SET status = 'active' 
        WHERE id = ${keyId}
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('重新激活VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }
}

export default VipKey;