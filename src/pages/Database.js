import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { neon } from '@neondatabase/serverless';

function Database() {
  const [dbVersion, setDbVersion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 测试数据库连接
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 检查环境变量是否配置
      const dbUrl = process.env.REACT_APP_DATABASE_URL;
      if (!dbUrl) {
        throw new Error('REACT_APP_DATABASE_URL 环境变量未配置');
      }
      
      // 验证连接字符串格式
      if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
        throw new Error('数据库连接字符串格式无效，必须以 postgresql:// 或 postgres:// 开头');
      }
      
      // 注意：在生产环境中，不建议在前端直接连接数据库
      // 这里仅用于演示目的
      console.log('尝试连接数据库...');
      const sql = neon(dbUrl);
      const response = await sql`SELECT version()`;
      setDbVersion(response[0].version);
    } catch (err) {
      console.error('数据库连接错误:', err);
      setError(`连接失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography 
        variant="h3" 
        gutterBottom
        sx={{ 
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.05em',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 15px rgba(0, 229, 255, 0.3)',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        数据库连接测试
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Neon PostgreSQL 连接状态
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={testConnection}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? <CircularProgress size={20} /> : '测试连接'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            连接失败: {error}
          </Alert>
        )}
        
        {dbVersion && (
          <Alert severity="success" sx={{ mb: 2 }}>
            连接成功！数据库版本: {dbVersion}
          </Alert>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          注意：请确保在 .env 文件中正确配置了 DATABASE_URL，
          并且在前端使用时需要将变量名改为 REACT_APP_DATABASE_URL。
        </Typography>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            ⚠️ 安全警告
          </Typography>
          <Typography variant="body2">
            在前端直接连接数据库存在安全风险！数据库凭据会暴露给客户端。
            在生产环境中，应该通过后端API来访问数据库。此功能仅用于开发测试。
          </Typography>
        </Alert>
        
        <Typography variant="h6" gutterBottom>
          配置说明
        </Typography>
        
        <Typography variant="body1" paragraph>
          1. 在 .env 文件中添加数据库连接字符串：
        </Typography>
        
        <Box component="pre" sx={{ 
          backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary, 
          p: 2, 
          borderRadius: 1,
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
{`REACT_APP_DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"`}
        </Box>
        
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          2. 重启开发服务器以加载新的环境变量
        </Typography>
        
        <Typography variant="body1" paragraph>
          3. 点击"测试连接"按钮验证数据库连接
        </Typography>
      </Paper>
    </Box>
  );
}

export default Database;