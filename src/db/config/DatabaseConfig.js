/**
 * 数据库配置管理模块
 * 提供数据库连接配置验证、错误处理和连接管理功能
 */

class DatabaseConfig {
  constructor() {
    this.connectionString = null;
    this.isValidated = false;
    this.lastError = null;
  }

  /**
   * 验证数据库连接字符串格式
   * @param {string} connectionString - 数据库连接字符串
   * @returns {object} 验证结果
   */
  validateConnectionString(connectionString) {
    if (!connectionString) {
      return {
        isValid: false,
        error: '数据库连接字符串不能为空'
      };
    }

    // 检查基本格式
    const postgresqlRegex = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):?(\d+)?\/([^?]+)(\?.*)?$/;
    const postgresRegex = /^postgres:\/\/([^:]+):([^@]+)@([^:]+):?(\d+)?\/([^?]+)(\?.*)?$/;
    
    if (!postgresqlRegex.test(connectionString) && !postgresRegex.test(connectionString)) {
      return {
        isValid: false,
        error: '数据库连接字符串格式无效。正确格式: postgresql://username:password@host:port/database?options'
      };
    }

    // 解析连接字符串组件
    const match = connectionString.match(postgresqlRegex) || connectionString.match(postgresRegex);
    if (!match) {
      return {
        isValid: false,
        error: '无法解析数据库连接字符串'
      };
    }

    const [, username, password, host, port, database, options] = match;

    // 验证各个组件
    if (!username || username.includes('<') || username.includes('>')) {
      return {
        isValid: false,
        error: '用户名无效或包含占位符'
      };
    }

    if (!password || password.includes('<') || password.includes('>')) {
      return {
        isValid: false,
        error: '密码无效或包含占位符'
      };
    }

    if (!host || host.includes('<') || host.includes('>')) {
      return {
        isValid: false,
        error: '主机名无效或包含占位符'
      };
    }

    if (!database || database.includes('<') || database.includes('>')) {
      return {
        isValid: false,
        error: '数据库名无效或包含占位符'
      };
    }

    // 验证端口号
    const portNum = port ? parseInt(port) : 5432;
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return {
        isValid: false,
        error: '端口号无效'
      };
    }

    return {
      isValid: true,
      components: {
        username,
        password,
        host,
        port: portNum,
        database,
        options: options || ''
      }
    };
  }

  /**
   * 获取并验证数据库连接字符串
   * @returns {object} 连接配置结果
   */
  getConnectionConfig() {
    try {
      // 优先使用前端环境变量
      let connectionString = process.env.REACT_APP_DATABASE_URL;
      
      // 如果前端环境变量不存在，尝试后端环境变量
      if (!connectionString) {
        connectionString = process.env.DATABASE_URL;
      }

      if (!connectionString) {
        return {
          success: false,
          error: '未找到数据库连接配置。请检查 REACT_APP_DATABASE_URL 或 DATABASE_URL 环境变量。',
          fallbackToLocalStorage: true
        };
      }

      // 验证连接字符串
      const validation = this.validateConnectionString(connectionString);
      if (!validation.isValid) {
        return {
          success: false,
          error: `数据库连接配置无效: ${validation.error}`,
          fallbackToLocalStorage: true
        };
      }

      this.connectionString = connectionString;
      this.isValidated = true;
      this.lastError = null;

      return {
        success: true,
        connectionString,
        components: validation.components
      };
    } catch (error) {
      this.lastError = error.message;
      return {
        success: false,
        error: `获取数据库配置失败: ${error.message}`,
        fallbackToLocalStorage: true
      };
    }
  }

  /**
   * 测试数据库连接
   * @returns {Promise<object>} 连接测试结果
   */
  async testConnection() {
    const config = this.getConnectionConfig();
    if (!config.success) {
      return config;
    }

    try {
      // 动态导入 neon 以避免构建时错误
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(config.connectionString);
      
      // 执行简单查询测试连接
      const result = await sql`SELECT version() as version, now() as current_time`;
      
      return {
        success: true,
        message: '数据库连接成功',
        serverInfo: result[0]
      };
    } catch (error) {
      console.error('数据库连接测试失败:', error);
      
      // 检查是否是包未安装的错误
      if (error.message.includes('Cannot resolve module') || error.message.includes('@neondatabase/serverless')) {
        return {
          success: false,
          error: '请先安装 @neondatabase/serverless 包: npm install @neondatabase/serverless',
          fallbackToLocalStorage: true
        };
      }
      
      return {
        success: false,
        error: `数据库连接失败: ${error.message}`,
        fallbackToLocalStorage: true
      };
    }
  }

  /**
   * 创建数据库连接实例
   * @returns {Promise<object>} 连接实例或错误信息
   */
  async createConnection() {
    const config = this.getConnectionConfig();
    if (!config.success) {
      return config;
    }

    try {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(config.connectionString);
      
      return {
        success: true,
        connection: sql
      };
    } catch (error) {
      console.error('创建数据库连接失败:', error);
      return {
        success: false,
        error: `创建数据库连接失败: ${error.message}`,
        fallbackToLocalStorage: true
      };
    }
  }

  /**
   * 获取连接状态
   * @returns {object} 连接状态信息
   */
  getConnectionStatus() {
    return {
      isValidated: this.isValidated,
      hasConnectionString: !!this.connectionString,
      lastError: this.lastError
    };
  }

  /**
   * 重置配置
   */
  reset() {
    this.connectionString = null;
    this.isValidated = false;
    this.lastError = null;
  }

  /**
   * 生成示例配置
   * @returns {string} 示例连接字符串
   */
  getExampleConnectionString() {
    return 'postgresql://username:password@hostname:5432/database?sslmode=require';
  }

  /**
   * 获取配置帮助信息
   * @returns {object} 帮助信息
   */
  getConfigHelp() {
    return {
      environmentVariables: [
        'REACT_APP_DATABASE_URL (推荐用于前端)',
        'DATABASE_URL (后端兼容)'
      ],
      format: 'postgresql://username:password@hostname:port/database?options',
      example: this.getExampleConnectionString(),
      commonIssues: [
        '确保连接字符串包含端口号 (通常是 5432)',
        '检查用户名和密码是否正确',
        '确保主机名可访问',
        '验证数据库名称是否存在',
        '对于 Neon 数据库，确保使用 sslmode=require'
      ]
    };
  }
}

export default DatabaseConfig;