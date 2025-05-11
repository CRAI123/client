import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Link, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { isAuthenticated, validateCredentials, login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // 检查用户是否已登录
  useEffect(() => {
    if (isAuthenticated) {
      // 如果已登录，重定向到首页
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // 清除错误信息
    setError('');
  };

  // 处理登录
  const handleLogin = (e) => {
    e.preventDefault();
    
    // 简单验证
    if (!formData.username || !formData.password) {
      setError(language === 'zh' ? '请填写所有字段' : 'Please fill in all fields');
      return;
    }
    
    // 验证用户凭据
    const result = validateCredentials(formData.username, formData.password);
    
    if (result.success) {
      // 登录成功
      login(result.user);
      navigate('/');
    } else {
      // 登录失败
      setError(language === 'zh' ? '用户名或密码错误' : 'Invalid username or password');
    }
  };

  // 切换密码可见性
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ 
      mt: 8, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* 背景装饰 */}
      <Box sx={{ 
        position: 'absolute', 
        top: '-50px', 
        right: '10%', 
        width: '150px', 
        height: '150px', 
        border: '1px solid rgba(0, 229, 255, 0.2)', 
        borderRadius: '4px',
        transform: 'rotate(45deg)',
        opacity: 0.3,
        zIndex: 0
      }} />
      
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.05em',
          background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
          mb: 4
        }}
      >
        {language === 'zh' ? '登录' : 'Login'}
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: '400px',
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '8px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label={language === 'zh' ? '用户名' : 'Username'}
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'rgba(0, 229, 255, 0.7)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 229, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 229, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(0, 229, 255, 0.7)',
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={language === 'zh' ? '密码' : 'Password'}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'rgba(0, 229, 255, 0.7)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? 
                      <VisibilityOffIcon sx={{ color: 'rgba(0, 229, 255, 0.7)' }} /> : 
                      <VisibilityIcon sx={{ color: 'rgba(0, 229, 255, 0.7)' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 229, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 229, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(0, 229, 255, 0.7)',
                },
              },
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              py: 1.2,
              background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
              '&:hover': {
                background: 'linear-gradient(90deg, #33eaff, #00e5ff)',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.7)',
              }
            }}
          >
            {language === 'zh' ? '登录' : 'Login'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              {language === 'zh' ? '还没有账号？' : 'Don\'t have an account? '}
              <Link 
                component={RouterLink} 
                to="/register" 
                sx={{ 
                  color: '#00e5ff',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    textShadow: '0 0 8px rgba(0, 229, 255, 0.5)',
                  }
                }}
              >
                {language === 'zh' ? '立即注册' : 'Register now'}
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}