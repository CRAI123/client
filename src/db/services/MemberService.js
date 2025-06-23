// 会员服务层 - 整合会员和VIP密钥业务逻辑
import Member from '../models/Member.js';
import VipKey from '../models/VipKey.js';
import DatabaseConfig from '../config/DatabaseConfig.js';

class MemberService {
  constructor() {
    this.memberModel = new Member();
    this.vipKeyModel = new VipKey();
    this.dbConfig = new DatabaseConfig();
    this.isConnected = false;
    this.connectionError = null;
  }

  // 初始化数据库表
  async initializeTables() {
    try {
      // 首先验证数据库配置
      const configResult = this.dbConfig.getConnectionConfig();
      if (!configResult.success) {
        this.connectionError = configResult.error;
        console.warn('数据库配置无效，将使用 localStorage 作为后备存储:', configResult.error);
        return { 
          success: false, 
          error: configResult.error,
          fallbackToLocalStorage: true
        };
      }

      // 测试数据库连接
      const connectionTest = await this.dbConfig.testConnection();
      if (!connectionTest.success) {
        this.connectionError = connectionTest.error;
        console.warn('数据库连接失败，将使用 localStorage 作为后备存储:', connectionTest.error);
        return {
          success: false,
          error: connectionTest.error,
          fallbackToLocalStorage: true
        };
      }

      // 连接成功，创建表
      const memberResult = await this.memberModel.createMemberTable();
      const vipKeyResult = await this.vipKeyModel.createVipKeyTable();
      
      if (memberResult.success && vipKeyResult.success) {
        this.isConnected = true;
        this.connectionError = null;
        return { 
          success: true, 
          message: '数据库表初始化成功',
          serverInfo: connectionTest.serverInfo
        };
      } else {
        const error = `表创建失败: ${memberResult.error || vipKeyResult.error}`;
        this.connectionError = error;
        return { 
          success: false, 
          error,
          fallbackToLocalStorage: true
        };
      }
    } catch (error) {
      console.error('初始化数据库表失败:', error);
      this.connectionError = error.message;
      return { 
        success: false, 
        error: error.message,
        fallbackToLocalStorage: true
      };
    }
  }

  // 会员注册
  async registerMember(memberData) {
    try {
      const { username, email, password } = memberData;
      
      // 检查用户名是否已存在
      const existingUser = await this.memberModel.getMemberByUsername(username);
      if (existingUser.success && existingUser.data) {
        return { success: false, error: '用户名已存在' };
      }
      
      // 检查邮箱是否已存在
      const existingEmail = await this.memberModel.getMemberByEmail(email);
      if (existingEmail.success && existingEmail.data) {
        return { success: false, error: '邮箱已被注册' };
      }
      
      // 这里应该对密码进行哈希处理
      // 实际应用中使用 bcrypt 等库
      const passwordHash = this.hashPassword(password);
      
      const result = await this.memberModel.createMember({
        username,
        email,
        passwordHash
      });
      
      return result;
    } catch (error) {
      console.error('会员注册失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 会员登录
  async loginMember(username, password) {
    try {
      const memberResult = await this.memberModel.getMemberByUsername(username);
      
      if (!memberResult.success || !memberResult.data) {
        return { success: false, error: '用户名或密码错误' };
      }
      
      const member = memberResult.data;
      
      // 验证密码
      if (!this.verifyPassword(password, member.password_hash)) {
        return { success: false, error: '用户名或密码错误' };
      }
      
      // 更新最后登录时间
      await this.memberModel.updateLastLogin(member.id);
      
      // 返回会员信息（不包含密码）
      const { password_hash, ...memberInfo } = member;
      return { success: true, data: memberInfo };
    } catch (error) {
      console.error('会员登录失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 激活VIP密钥
  async activateMemberVip(memberId, keyCode) {
    try {
      // 验证VIP密钥
      const keyValidation = await this.vipKeyModel.validateVipKey(keyCode);
      if (!keyValidation.success) {
        return keyValidation;
      }
      
      const vipKey = keyValidation.data;
      
      // 使用VIP密钥
      const useResult = await this.vipKeyModel.useVipKey(keyCode, memberId);
      if (!useResult.success) {
        return useResult;
      }
      
      // 计算VIP过期时间
      let expiresAt = null;
      if (vipKey.key_type === 'temporary') {
        // 临时密钥默认30天有效期
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
      }
      // permanent 类型的密钥不设置过期时间
      
      // 激活会员VIP
      const activateResult = await this.memberModel.activateVipKey(
        memberId, 
        keyCode, 
        vipKey.vip_level, 
        expiresAt
      );
      
      return activateResult;
    } catch (error) {
      console.error('激活VIP失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 检查会员VIP状态
  async checkMemberVipStatus(memberId) {
    try {
      const memberResult = await this.memberModel.getMemberByUsername(memberId);
      if (!memberResult.success || !memberResult.data) {
        return { success: false, error: '会员不存在' };
      }
      
      const member = memberResult.data;
      
      // 检查VIP是否过期
      if (member.vip_expires_at && new Date(member.vip_expires_at) < new Date()) {
        // VIP已过期，重置为基础会员
        await this.memberModel.activateVipKey(memberId, null, 'basic', null);
        return { 
          success: true, 
          data: { 
            isVip: false, 
            vipLevel: 'basic', 
            message: 'VIP已过期' 
          } 
        };
      }
      
      return {
        success: true,
        data: {
          isVip: member.vip_level !== 'basic',
          vipLevel: member.vip_level,
          vipKey: member.vip_key,
          activatedAt: member.vip_activated_at,
          expiresAt: member.vip_expires_at
        }
      };
    } catch (error) {
      console.error('检查VIP状态失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 管理员功能：创建VIP密钥
  async createVipKeys(keyData, count = 1) {
    try {
      if (count === 1) {
        return await this.vipKeyModel.createVipKey(keyData);
      } else {
        return await this.vipKeyModel.createBatchVipKeys(count, keyData);
      }
    } catch (error) {
      console.error('创建VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 管理员功能：获取会员列表
  async getMemberList(page = 1, pageSize = 20) {
    try {
      const offset = (page - 1) * pageSize;
      return await this.memberModel.getAllMembers(pageSize, offset);
    } catch (error) {
      console.error('获取会员列表失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 管理员功能：获取VIP密钥列表
  async getVipKeyList(filters = {}, page = 1, pageSize = 20) {
    try {
      const offset = (page - 1) * pageSize;
      return await this.vipKeyModel.getVipKeys({ ...filters, limit: pageSize, offset });
    } catch (error) {
      console.error('获取VIP密钥列表失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 管理员功能：获取统计数据
  async getDashboardStats() {
    try {
      const memberStats = await this.memberModel.getMemberStats();
      const vipKeyStats = await this.vipKeyModel.getVipKeyStats();
      
      if (memberStats.success && vipKeyStats.success) {
        return {
          success: true,
          data: {
            members: memberStats.data,
            vipKeys: vipKeyStats.data
          }
        };
      } else {
        return { 
          success: false, 
          error: memberStats.error || vipKeyStats.error 
        };
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 简单的密码哈希（实际应用中应使用更安全的方法）
  hashPassword(password) {
    // 这里应该使用 bcrypt 等安全的哈希库
    // 这只是一个简单的示例
    return Buffer.from(password).toString('base64');
  }

  /**
   * 获取数据库连接状态
   * @returns {object} 连接状态信息
   */
  getConnectionStatus() {
    const dbStatus = this.dbConfig.getConnectionStatus();
    return {
      isConnected: this.isConnected,
      connectionError: this.connectionError,
      isValidated: dbStatus.isValidated,
      hasConnectionString: dbStatus.hasConnectionString,
      usingLocalStorage: !this.isConnected,
      configHelp: this.dbConfig.getConfigHelp()
    };
  }

  /**
   * 获取存储类型
   * @returns {string} 存储类型描述
   */
  getStorageType() {
    return this.isConnected ? 'Database' : 'LocalStorage';
  }

  // 简单的密码验证（实际应用中应使用更安全的方法）
  verifyPassword(password, hash) {
    // 这里应该使用 bcrypt 等安全的验证方法
    // 这只是一个简单的示例
    return Buffer.from(password).toString('base64') === hash;
  }

  // 初始化默认VIP密钥（用于演示）
  async initializeDefaultVipKeys() {
    try {
      const defaultKeys = [
        'ABCD-1234-EFGH-5678',
        'IJKL-9012-MNOP-3456',
        'QRST-7890-UVWX-1234',
        'YZAB-5678-CDEF-9012',
        'GHIJ-3456-KLMN-7890'
      ];

      const results = [];
      for (const keyCode of defaultKeys) {
        const result = await this.vipKeyModel.createVipKey({
          keyCode,
          keyType: 'permanent',
          vipLevel: 'premium',
          maxUsageCount: -1, // 无限制使用
          createdBy: 'system',
          description: '系统默认永久VIP密钥'
        });
        
        if (result.success) {
          results.push(result.data);
        }
      }

      return { success: true, data: results };
    } catch (error) {
      console.error('初始化默认VIP密钥失败:', error);
      return { success: false, error: error.message };
    }
  }
}

export default MemberService;