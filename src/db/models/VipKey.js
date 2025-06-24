// VipKey.js - VIP密钥数据模型
import DatabaseConfig from '../config/DatabaseConfig.js';

class VipKey {
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

  // 创建VIP密钥表
  async createVipKeyTable() {
    try {
      const sql = await this.getConnection();
      await sql`
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
      await sql`CREATE INDEX IF NOT EXISTS idx_vip_keys_code ON vip_keys(key_code)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_vip_keys_status ON vip_keys(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_vip_keys_type ON vip_keys(key_type)`;
      
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

  // 计算有效期
  calculateExpiryDate(validityPeriod) {
    const now = new Date();
    switch (validityPeriod) {
      case '1month':
        return new Date(now.setMonth(now.getMonth() + 1));
      case '6months':
        return new Date(now.setMonth(now.getMonth() + 6));
      case '1year':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      case 'permanent':
        return null; // 永久有效
      default:
        return null;
    }
  }

  // 创建VIP密钥
  async createVipKey(keyData) {
    try {
      const sql = await this.getConnection();
      const {
        keyCode = this.generateKeyCode(),
        keyType = 'temporary',
        vipLevel = 'premium',
        maxUsageCount = 1,
        validityPeriod = '1month', // 新增：有效期类型
        expiresAt = null,
        createdBy = 'system',
        description = ''
      } = keyData;

      // 如果没有指定过期时间但指定了有效期类型，自动计算过期时间
      let finalExpiresAt = expiresAt;
      if (!expiresAt && validityPeriod) {
        finalExpiresAt = this.calculateExpiryDate(validityPeriod);
        // 如果是永久密钥，设置keyType为permanent
        if (validityPeriod === 'permanent') {
          keyData.keyType = 'permanent';
        }
      }

      const result = await sql`
        INSERT INTO vip_keys (
          key_code, key_type, vip_level, max_usage_count, 
          expires_at, created_by, description
        )
        VALUES (
          ${keyCode}, ${keyData.keyType || keyType}, ${vipLevel}, ${maxUsageCount},
          ${finalExpiresAt}, ${createdBy}, ${description}
        )
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('创建VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 创建指定有效期的VIP密钥
  async createVipKeyWithValidity(validityPeriod, options = {}) {
    const {
      vipLevel = 'premium',
      maxUsageCount = 1,
      createdBy = 'system',
      description = ''
    } = options;

    const validityDescriptions = {
      '1month': '1个月有效期',
      '6months': '6个月有效期', 
      '1year': '1年有效期',
      'permanent': '永久有效'
    };

    const keyData = {
      validityPeriod,
      vipLevel,
      maxUsageCount: validityPeriod === 'permanent' ? -1 : maxUsageCount, // 永久密钥无使用次数限制
      createdBy,
      description: description || validityDescriptions[validityPeriod] || ''
    };

    return await this.createVipKey(keyData);
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

  // 批量创建指定有效期的VIP密钥
  async createBatchVipKeysWithValidity(count, validityPeriod, options = {}) {
    const keyData = {
      validityPeriod,
      ...options
    };
    return await this.createBatchVipKeys(count, keyData);
  }

  // 验证VIP密钥
  async validateVipKey(keyCode) {
    try {
      const sql = await this.getConnection();
      const result = await sql`
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
        await sql`
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
      const sql = await this.getConnection();
      // 先验证密钥
      const validation = await this.validateVipKey(keyCode);
      if (!validation.success) {
        return validation;
      }

      const key = validation.data;
      const newUsageCount = key.current_usage_count + 1;
      
      // 构建更新参数
      const updateData = {
        current_usage_count: newUsageCount,
        last_used_at: new Date(),
        used_by_member_id: memberId
      };

      // 如果是首次使用
      if (key.current_usage_count === 0) {
        updateData.first_used_at = new Date();
      }

      // 如果达到最大使用次数，标记为已使用
      if (key.max_usage_count !== -1 && newUsageCount >= key.max_usage_count) {
        updateData.status = 'used';
      }

      // 执行更新
      const result = await sql`
        UPDATE vip_keys 
        SET current_usage_count = ${updateData.current_usage_count},
            last_used_at = CURRENT_TIMESTAMP,
            used_by_member_id = ${updateData.used_by_member_id}
            ${key.current_usage_count === 0 ? sql`, first_used_at = CURRENT_TIMESTAMP` : sql``}
            ${updateData.status ? sql`, status = ${updateData.status}` : sql``}
        WHERE id = ${key.id}
        RETURNING *
      `;
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('使用VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取VIP密钥列表
  async getVipKeys(filters = {}) {
    try {
      const sql = await this.getConnection();
      const { status, keyType, limit = 50, offset = 0 } = filters;
      
      // 构建动态查询
      let whereConditions = [];
      let queryParams = [];
      
      if (status) {
        whereConditions.push(`status = $${queryParams.length + 1}`);
        queryParams.push(status);
      }
      
      if (keyType) {
        whereConditions.push(`key_type = $${queryParams.length + 1}`);
        queryParams.push(keyType);
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      const query = `SELECT * FROM vip_keys ${whereClause} ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(limit, offset);
      
      const result = await sql.unsafe(query, queryParams);
      return { success: true, data: result };
    } catch (error) {
      console.error('获取VIP密钥列表失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取VIP密钥统计
  async getVipKeyStats() {
    try {
      const sql = await this.getConnection();
      const result = await sql`
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
      const sql = await this.getConnection();
      const result = await sql`
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
      const sql = await this.getConnection();
      const result = await sql`
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