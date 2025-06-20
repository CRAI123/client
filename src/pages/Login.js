import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Link, InputAdornment, IconButton, Divider, Grid } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import QrCodeIcon from '@mui/icons-material/QrCode';
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import qs from 'qs';

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
  const [wechatQrCode, setWechatQrCode] = useState('');
  const [wechatStatus, setWechatStatus] = useState('');
  const [scenes, setScenes] = useState('');
  const [checkInterval, setCheckInterval] = useState(null);
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'wechat'

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

  // 获取微信登录二维码
  const getWechatQrCode = async () => {
    console.log('按钮被点击了');
    try {
      setWechatStatus('正在获取二维码...');
      console.log('开始获取二维码，API地址:', API_CONFIG.WECHAT_LOGIN_API.GET_QRCODE);
      
      const postData = {
        apiname: 'smdl5513210001',
        apipwsd: 'd5972de7445b5151254031bd4ab3d303'
      };
      
      console.log('发送的数据:', postData);
      
      const response = await axios.post(API_CONFIG.WECHAT_LOGIN_API.GET_QRCODE, qs.stringify(postData), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('API响应:', response.data);
      
      const result = JSON.parse(response.data);
      console.log('解析后的结果:', result);
      
      if (result && result.imgurl && result.scenes) {
        setWechatQrCode(result.imgurl);
        setScenes(result.scenes);
        setWechatStatus('请使用微信扫描二维码');
        
        // 清除之前的轮询
        if (checkInterval) {
          clearInterval(checkInterval);
        }
        
        // 开始轮询检查登录状态 - 使用setInterval每秒检查一次
        const intervalId = setInterval(() => {
          checkWechatStatus(result.scenes);
        }, 1000);
        
        setCheckInterval(intervalId);
      } else {
        setWechatStatus('获取二维码失败：响应数据格式错误');
      }
    } catch (error) {
      console.error('获取微信二维码失败:', error);
      console.error('错误详情:', error.response?.data || error.message);
      setWechatStatus('获取二维码失败，请重试');
    }
  };

  // 检查微信扫码状态
  const checkWechatStatus = async (sceneId) => {
    const currentScene = sceneId || scenes;
    if (!currentScene) return;
    
    try {
      const statusUrl = `${API_CONFIG.WECHAT_LOGIN_API.CHECK_STATUS}?scene=${currentScene}`;
      const response = await axios.get(statusUrl);
      const data = JSON.parse(response.data);
      
      console.log('状态检查结果:', data);
      
      if (data.code === 200) {
        // 登录成功
        setWechatStatus(`登录成功，唯一标识：${data.openid}`);
        if (checkInterval) {
          clearInterval(checkInterval);
          setCheckInterval(null);
        }
        // 处理登录成功逻辑
        console.log('微信登录成功，openid:', data.openid);
        // 模拟登录成功，创建用户会话
        const wechatUser = {
          id: data.openid,
          username: `微信用户_${data.openid.substring(0, 8)}`,
          loginType: 'wechat',
          openid: data.openid
        };
        login(wechatUser);
        navigate('/profile');
      } else if (data.code === 201) {
        setWechatStatus('请使用微信扫描二维码');
        // setInterval会自动继续轮询
      } else if (data.code === 202) {
        setWechatStatus('扫码成功，请点击确认授权登录');
        // setInterval会自动继续轮询
      } else if (data.code === 203) {
        setWechatStatus('服务器发生错误');
        if (checkInterval) {
          clearInterval(checkInterval);
          setCheckInterval(null);
        }
      } else {
        setWechatStatus('未知状态码：' + data.code);
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
      setWechatStatus('检查状态失败：' + error.message);
    }
  };

  // 切换登录模式
  const switchLoginMode = (mode) => {
    setLoginMode(mode);
    setError('');
    
    // 清除之前的轮询
    if (checkInterval) {
      clearInterval(checkInterval);
      setCheckInterval(null);
    }
    
    if (mode === 'wechat') {
      // 切换到微信登录模式时自动获取二维码
      setWechatQrCode('');
      setWechatStatus('');
      setScenes('');
      getWechatQrCode();
    } else {
      // 切换到密码登录模式时清除微信登录相关状态
      setWechatQrCode('');
      setWechatStatus('');
      setScenes('');
    }
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [checkInterval]);

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
          maxWidth: '500px',
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '8px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* 登录模式切换按钮 */}
        <Box sx={{ display: 'flex', mb: 3, gap: 1 }}>
          <Button
            variant={loginMode === 'password' ? 'contained' : 'outlined'}
            onClick={() => switchLoginMode('password')}
            sx={{
              flex: 1,
              borderColor: 'rgba(0, 229, 255, 0.5)',
              color: loginMode === 'password' ? '#000' : 'rgba(0, 229, 255, 0.8)',
              background: loginMode === 'password' ? 'linear-gradient(90deg, #00e5ff, #33eaff)' : 'transparent'
            }}
          >
            {language === 'zh' ? '密码登录' : 'Password Login'}
          </Button>
          <Button
            variant={loginMode === 'wechat' ? 'contained' : 'outlined'}
            onClick={() => switchLoginMode('wechat')}
            startIcon={<QrCodeIcon />}
            sx={{
              flex: 1,
              borderColor: 'rgba(0, 229, 255, 0.5)',
              color: loginMode === 'wechat' ? '#000' : 'rgba(0, 229, 255, 0.8)',
              background: loginMode === 'wechat' ? 'linear-gradient(90deg, #00e5ff, #33eaff)' : 'transparent'
            }}
          >
            {language === 'zh' ? '微信登录' : 'WeChat Login'}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loginMode === 'password' ? (
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
        ) : (
          // 微信扫码登录界面
          <Box sx={{ textAlign: 'center' }}>
            {wechatQrCode ? (
              <Box>
                <img 
                  src={wechatQrCode} 
                  alt="微信登录二维码" 
                  style={{ 
                    width: '250px', 
                    height: '250px', 
                    border: '2px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }} 
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(0, 229, 255, 0.8)',
                    mb: 2
                  }}
                >
                  {wechatStatus}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={getWechatQrCode}
                  sx={{
                    borderColor: 'rgba(0, 229, 255, 0.5)',
                    color: 'rgba(0, 229, 255, 0.8)',
                    '&:hover': {
                      borderColor: 'rgba(0, 229, 255, 0.8)',
                      backgroundColor: 'rgba(0, 229, 255, 0.1)'
                    }
                  }}
                >
                  {language === 'zh' ? '刷新二维码' : 'Refresh QR Code'}
                </Button>
              </Box>
            ) : (
              <Box>
                <QrCodeIcon sx={{ fontSize: 100, color: 'rgba(0, 229, 255, 0.5)', mb: 2 }} />
                <Typography variant="body1" sx={{ color: 'rgba(0, 229, 255, 0.8)', mb: 2 }}>
                  {language === 'zh' ? '点击获取微信登录二维码' : 'Click to get WeChat login QR code'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log('按钮被点击了');
                    getWechatQrCode();
                  }}
                  startIcon={<QrCodeIcon />}
                  sx={{
                    background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #33eaff, #00e5ff)'
                    }
                  }}
                >
                  {language === 'zh' ? '获取二维码' : 'Get QR Code'}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}