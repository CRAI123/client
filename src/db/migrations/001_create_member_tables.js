// 数据库迁移文件 - 创建会员和VIP密钥表
import MemberService from '../services/MemberService.js';

class CreateMemberTables {
  constructor() {
    this.memberService = new MemberService();
  }

  // 执行迁移
  async up() {
    try {
      console.log('开始执行数据库迁移...');
      
      // 初始化表结构
      const initResult = await this.memberService.initializeTables();
      if (!initResult.success) {
        throw new Error(initResult.error);
      }
      console.log('✅ 数据库表创建成功');
      
      // 初始化默认VIP密钥
      const keysResult = await this.memberService.initializeDefaultVipKeys();
      if (keysResult.success) {
        console.log(`✅ 初始化了 ${keysResult.data.length} 个默认VIP密钥`);
      } else {
        console.warn('⚠️ 默认VIP密钥初始化失败:', keysResult.error);
      }
      
      console.log('🎉 数据库迁移完成！');
      return { success: true, message: '数据库迁移成功' };
    } catch (error) {
      console.error('❌ 数据库迁移失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 回滚迁移（可选）
  async down() {
    try {
      console.log('开始回滚数据库迁移...');
      
      // 注意：在生产环境中要谨慎使用DROP TABLE
      const sql = this.memberService.memberModel.sql;
      
      await sql`DROP TABLE IF EXISTS vip_keys CASCADE`;
      await sql`DROP TABLE IF EXISTS members CASCADE`;
      
      console.log('✅ 数据库表删除成功');
      return { success: true, message: '数据库回滚成功' };
    } catch (error) {
      console.error('❌ 数据库回滚失败:', error);
      return { success: false, error: error.message };
    }
  }
}

// 导出迁移实例
const migration = new CreateMemberTables();
export default migration;

// 如果直接运行此文件，执行迁移
if (import.meta.url === `file://${process.argv[1]}`) {
  migration.up().then(result => {
    console.log('迁移结果:', result);
    process.exit(result.success ? 0 : 1);
  });
}