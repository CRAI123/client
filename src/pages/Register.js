import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Link, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Register() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { isAuthenticated, register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  // 处理注册
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 验证表单
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(language === 'zh' ? '请填写所有字段' : 'Please fill in all fields');
      return;
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
      return;
    }
    
    // 验证密码长度
    if (formData.password.length < 6) {
      setError(language === 'zh' ? '密码长度至少为6个字符' : 'Password must be at least 6 characters long');
      return;
    }
    
    // 验证两次密码是否一致
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match');
      return;
    }
    
    try {
      // 使用AuthContext的register函数注册用户
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (!result.success) {
        // 注册失败
        setError(language === 'zh' ? result.message : 
          (result.message === '用户名已存在' ? 'Username already exists' : 
           result.message === '邮箱已被注册' ? 'Email already registered' : 
           result.message === '数据库连接错误' ? 'Database connection error' :
           'Registration failed'));
        return;
      }
      
      // 显示成功消息
      setSuccess(true);
      
      // 清空表单
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // 3秒后跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('注册过程中出错:', error);
      setError(language === 'zh' ? '注册失败，请稍后重试' : 'Registration failed, please try again later');
    }
  };

  // 切换密码可见性
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 切换确认密码可见性
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
      <Box sx={{ 
        position: 'absolute', 
        bottom: '10%', 
        left: '5%', 
        width: '100px', 
        height: '100px', 
        border: '1px solid rgba(255, 0, 229, 0.2)', 
        borderRadius: '50%',
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
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
          mb: 4
        }}
      >
        {language === 'zh' ? '注册' : 'Register'}
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
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {language === 'zh' ? '注册成功！即将跳转到登录页...' : 'Registration successful! Redirecting to login...'}
          </Alert>
        )}
        
        <form onSubmit={handleRegister}>
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
            id="email"
            label={language === 'zh' ? '邮箱' : 'Email'}
            name="email"
            autoComplete="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: 'rgba(0, 229, 255, 0.7)' }} />
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
            autoComplete="new-password"
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
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label={language === 'zh' ? '确认密码' : 'Confirm Password'}
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
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
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? 
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
                background: 'linear-gradient(90deg, #8b5cf6, #6366f1)',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.7)',
              }
            }}
          >
            {language === 'zh' ? '注册' : 'Register'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              {language === 'zh' ? '已有账号？' : 'Already have an account? '}
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ 
                  color: '#6366f1',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    textShadow: '0 0 8px rgba(0, 229, 255, 0.5)',
                  }
                }}
              >
                {language === 'zh' ? '立即登录' : 'Login now'}
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}