import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, useTheme, Divider, Snackbar, Alert, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import { createContactTable, insertContactMessage } from '../api/database';

function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(false);
  
  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = async () => {
    // 验证表单
    if (!formData.name || !formData.email || !formData.message) {
      setSnackbar({
        open: true,
        message: '请填写所有字段',
        severity: 'error'
      });
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbar({
        open: true,
        message: '请输入有效的邮箱地址',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      // 确保联系消息表存在
      await createContactTable();
      
      // 插入联系消息到数据库
      const result = await insertContactMessage(
        formData.name,
        formData.email,
        formData.message
      );

      if (result.success) {
        // 显示成功消息
        setSnackbar({
          open: true,
          message: '消息已成功发送到数据库！',
          severity: 'success'
        });

        // 重置表单
        setFormData({
          name: '',
          email: '',
          message: ''
        });

        // 同时保存到localStorage作为备份
        const contactData = {
          ...formData,
          timestamp: new Date().toISOString(),
          id: result.data.id,
          status: 'sent'
        };
        
        let contacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        contacts.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(contacts));
      } else {
        throw new Error(result.error || '数据库操作失败');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      
      // 如果数据库操作失败，尝试保存到localStorage
      try {
        const contactData = {
          ...formData,
          timestamp: new Date().toISOString(),
          id: Date.now(),
          status: 'local_backup'
        };
        
        let contacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        contacts.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(contacts));
        
        setSnackbar({
          open: true,
          message: '数据库连接失败，消息已保存到本地备份',
          severity: 'warning'
        });
      } catch (localError) {
        setSnackbar({
          open: true,
          message: '发送失败，请稍后再试',
          severity: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 关闭提示消息
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, position: 'relative', px: { xs: 2, sm: 0 } }}>
      {/* 背景装饰 */}
      <Box sx={{ 
        position: 'absolute', 
        top: '20%', 
        right: '5%', 
        width: '120px', 
        height: '120px', 
        border: '1px solid rgba(255, 0, 229, 0.2)', 
        borderRadius: '50%',
        opacity: 0.3,
        zIndex: 0
      }} />
      
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
        联系方式
      </Typography>
      
      <Divider sx={{ 
        mb: 4, 
        borderColor: 'rgba(0, 229, 255, 0.3)',
        '&::before, &::after': {
          borderColor: 'rgba(0, 229, 255, 0.3)',
        }
      }} />
      
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            p: 3, 
            height: '100%',
            borderLeft: '3px solid #00e5ff',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 25px rgba(0, 229, 255, 0.2)'
            },
          }}>
            <Box component="form" sx={{ mt: 1 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontFamily: '"Orbitron", sans-serif',
                  letterSpacing: '0.03em',
                  mb: 3,
                  color: theme.palette.primary.main
                }}
              >
                发送消息
              </Typography>
              
              <TextField
                fullWidth
                label="姓名"
                variant="outlined"
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                InputProps={{
                  sx: {
                    '&.MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 229, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 229, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1890ff',
                      },
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                label="邮箱"
                variant="outlined"
                margin="normal"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                InputProps={{
                  sx: {
                    '&.MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 229, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 229, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1890ff',
                      },
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                label="消息"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                InputProps={{
                  sx: {
                    '&.MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 229, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 229, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                      },
                    }
                  }
                }}
              />
              <Button 
                variant="contained" 
                size="large"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                sx={{ 
                  mt: 2,
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.2 },
                  borderRadius: '4px',
                  boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
                  '&:disabled': {
                    opacity: 0.6,
                    boxShadow: 'none'
                  }
                }}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              >
                {loading ? '发送中...' : '发送消息'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            p: 3, 
            height: '100%',
            borderLeft: '3px solid #ff00e5',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 25px rgba(255, 0, 229, 0.2)'
            },
          }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontFamily: '"Orbitron", sans-serif',
                letterSpacing: '0.03em',
                mb: 3,
                color: theme.palette.secondary.main
              }}
            >
              其他联系方式
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              p: 2,
              borderRadius: '4px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 229, 255, 0.1)'
            }}>
              <EmailIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                  邮箱
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  crstudio@crstudio.top
                </Typography>
              </Box>
            </Box>
            
            
            <Box sx={{ 
              mt: 4, 
              p: 2, 
              borderRadius: '4px',
              background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(255, 0, 229, 0.05) 100%)',
              border: '1px solid rgba(0, 229, 255, 0.1)'
            }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
                欢迎通过以上方式与我联系，我会尽快回复您的消息。
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Contact;