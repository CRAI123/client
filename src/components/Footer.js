import React, { useContext, useState } from 'react';
import { Box, Container, Typography, Link, TextField, Button, Grid, useTheme, Snackbar, Alert } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LanguageContext } from '../App';

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const { language } = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  
  return (
    <Box 
      component="footer" 
      sx={{
        py: 8,
        mt: 'auto',
        backgroundColor: '#121212',
        color: 'white'
      }}
    >
      {/* 提示消息 */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, sm: 6, md: 10 }} justifyContent="space-between">
          {/* 左侧 Logo 和版权信息 */}
          <Grid item xs={12} sm={6} md={4} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Orbitron", sans-serif',
                mb: 3,
                background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
              }}
            >
              CR Studio
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Copyright © {currentYear}. All rights reserved.
            </Typography>
            
            {/* 二维码区域 */}
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              {/* 公众号二维码 */}
              <Box>
                <img 
                  src="/images/qrcode_for_gh_b603ed04972b_258.jpg" 
                  alt="公众号二维码" 
                  style={{ 
                    width: '120px', 
                    height: '120px',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  扫码关注公众号
                </Typography>
              </Box>
              
              {/* 官方群二维码 */}
              <Box>
                <img 
                  src="/images/wechat_2025-06-20_202513_860.png" 
                  alt="官方群二维码" 
                  style={{ 
                    width: '120px', 
                    height: '120px',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  扫码加入官方群
                </Typography>
              </Box>
            </Box>
            
            {/* 邮件订阅框 */}
            <Box sx={{ display: 'none', mt: { xs: 3, md: 4 }, mb: { xs: 2, md: 3 } }}>
              <TextField
                placeholder={language === 'zh' ? "输入您的邮箱" : "Enter your email"}
                variant="outlined"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  backgroundColor: '#1e1e1e',
                  borderRadius: '4px 0 0 4px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRight: 'none',
                      borderRadius: '4px 0 0 4px',
                    },
                  },
                  flexGrow: 1
                }}
              />
              <Button 
                variant="contained" 
                color="primary"
                disabled={loading}
                onClick={async () => {
                  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setSnackbar({ 
                      open: true, 
                      message: language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email', 
                      severity: 'error' 
                    });
                    return;
                  }
                  
                  setLoading(true);
                  try {
                    const existingSubscriptions = JSON.parse(localStorage.getItem('subscriptionEmails') || '[]');
                    
                    if (existingSubscriptions.some(item => item.email === email)) {
                      setSnackbar({ 
                        open: true, 
                        message: language === 'zh' ? '该邮箱已订阅' : 'Email already subscribed', 
                        severity: 'info' 
                      });
                      return;
                    }
                    
                    const newSubscription = {
                      id: existingSubscriptions.length > 0 ? Math.max(...existingSubscriptions.map(s => s.id)) + 1 : 1,
                      email: email,
                      timestamp: new Date().toISOString()
                    };
                    
                    const updatedSubscriptions = [...existingSubscriptions, newSubscription];
                    localStorage.setItem('subscriptionEmails', JSON.stringify(updatedSubscriptions));
                    
                    setEmail('');
                    setSnackbar({ 
                      open: true, 
                      message: language === 'zh' ? '订阅成功！' : 'Subscribed successfully!', 
                      severity: 'success' 
                    });
                  } catch (error) {
                    setSnackbar({ 
                      open: true, 
                      message: language === 'zh' ? '订阅失败，请稍后重试' : 'Subscription failed, please try again later', 
                      severity: 'error' 
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                sx={{
                  borderRadius: '0 4px 4px 0',
                  boxShadow: 'none',
                  backgroundColor: theme.palette.primary.main,
                  minWidth: '80px'
                }}
              >
                {loading ? (language === 'zh' ? '处理中...' : 'Processing...') : (language === 'zh' ? "订阅" : "Subscribe")}
              </Button>
            </Box>
          </Grid>
          
          {/* Terms 区域 */}
          <Grid item xs={12} sm={6} md={2} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold' }}>
              {language === 'zh' ? "条款" : "Terms"}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/terms" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                {language === 'zh' ? "服务条款" : "Terms of Service"}
              </Link>
              <Link href="/privacy" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                {language === 'zh' ? "隐私政策" : "Privacy Policy"}
              </Link>
              <Link href="/cookies" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                {language === 'zh' ? "Cookie政策" : "Cookie Policy"}
              </Link>
            </Box>
          </Grid>
          
          {/* Supports 区域 */}
          <Grid item xs={12} sm={6} md={2} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold' }}>
              {language === 'zh' ? "支持" : "Supports"}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="/feedback" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                {language === 'zh' ? "反馈" : "Feedback"}
              </Link>
              <Link href="/docs" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                {language === 'zh' ? "文档" : "Docs"}
              </Link>
            </Box>
          </Grid>
          
          {/* Engage 区域 */}
          <Grid item xs={12} sm={6} md={2} sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold' }}>
              {language === 'zh' ? "互动" : "Engage"}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="https://discord.com" target="_blank" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                Discord <ArrowForwardIcon fontSize="small" sx={{ fontSize: '0.8rem', ml: 0.5 }} />
              </Link>
              <Link href="https://x.com/chnru513711" target="_blank" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: theme.palette.primary.main } }}>
                Twitter <ArrowForwardIcon fontSize="small" sx={{ fontSize: '0.8rem', ml: 0.5 }} />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;