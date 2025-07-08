import React, { useContext } from 'react';
import { Box, Typography, Button, useTheme, Paper, Grid, Card, CardContent } from '@mui/material';
import { LanguageContext } from '../App';
import DownloadIcon from '@mui/icons-material/Download';
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import WindowsIcon from '@mui/icons-material/Window';

function Download() {
  const theme = useTheme();
  const { language } = useContext(LanguageContext);

  const handleDownload = (platform) => {
    if (platform === 'windows') {
      // 下载Windows版本
      const link = document.createElement('a');
      link.href = '/images/CR Studio桌面端.exe';
      link.download = 'CR Studio桌面端.exe';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // 其他平台暂未提供
      alert(language === 'zh' ? '该平台版本即将推出，敬请期待！' : 'This platform version is coming soon!');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* 背景装饰 */}
      <Box sx={{ 
        position: 'absolute', 
        top: '20%', 
        right: '10%', 
        width: '150px', 
        height: '150px', 
        border: '1px solid rgba(0, 229, 255, 0.2)', 
        borderRadius: '4px',
        transform: 'rotate(30deg)',
        opacity: 0.3,
        zIndex: 0
      }} />
      <Box sx={{ 
        position: 'absolute', 
        bottom: '15%', 
        left: '8%', 
        width: '120px', 
        height: '120px', 
        border: '1px solid rgba(255, 0, 229, 0.2)', 
        borderRadius: '50%',
        opacity: 0.3,
        zIndex: 0
      }} />
      
      {/* 页面标题 */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6, 
        position: 'relative',
        zIndex: 1 
      }}>
        <Typography 
          variant="h2" 
          gutterBottom
          sx={{ 
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 700,
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
            mb: 2
          }}
        >
          {language === 'zh' ? '应用下载' : 'App Download'}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 4, 
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            mx: 'auto',
            letterSpacing: '0.03em',
            lineHeight: 1.6
          }}
        >
          {language === 'zh' ? '下载CR Studio应用，体验更好的功能和服务' : 'Download CR Studio app for better features and services'}
        </Typography>
      </Box>

      {/* 下载选项 */}
      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        {/* 桌面端 */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: 'rgba(30, 30, 30, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 30px rgba(0, 229, 255, 0.3)',
              border: '1px solid rgba(0, 229, 255, 0.4)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <ComputerIcon sx={{ 
                fontSize: 80, 
                color: theme.palette.primary.main, 
                mb: 2,
                filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))'
              }} />
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'white',
                mb: 2
              }}>
                {language === 'zh' ? '桌面端' : 'Desktop'}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: theme.palette.text.secondary,
                mb: 3,
                lineHeight: 1.6
              }}>
                {language === 'zh' ? '功能完整的桌面应用程序，提供最佳的用户体验' : 'Full-featured desktop application with the best user experience'}
              </Typography>
              
              {/* Windows版本 */}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleDownload('windows')}
                  startIcon={<WindowsIcon />}
                  endIcon={<DownloadIcon />}
                  sx={{
                    width: '100%',
                    py: 1.5,
                    mb: 1,
                    background: 'linear-gradient(45deg, #0078d4, #106ebe)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #106ebe, #005a9e)',
                      boxShadow: '0 0 20px rgba(0, 120, 212, 0.5)'
                    }
                  }}
                >
                  {language === 'zh' ? 'Windows 版本' : 'Windows Version'}
                </Button>
                <Typography variant="caption" sx={{ 
                  color: theme.palette.text.secondary,
                  display: 'block'
                }}>
                  {language === 'zh' ? '支持 Windows 10/11' : 'Supports Windows 10/11'}
                </Typography>
              </Box>

              {/* macOS版本 - 即将推出 */}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleDownload('macos')}
                  startIcon={<AppleIcon />}
                  disabled
                  sx={{
                    width: '100%',
                    py: 1.5,
                    mb: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {language === 'zh' ? 'macOS 版本' : 'macOS Version'}
                </Button>
                <Typography variant="caption" sx={{ 
                  color: theme.palette.text.secondary,
                  display: 'block'
                }}>
                  {language === 'zh' ? '即将推出' : 'Coming Soon'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 移动端 */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: 'rgba(30, 30, 30, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 0, 229, 0.2)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 30px rgba(255, 0, 229, 0.3)',
              border: '1px solid rgba(255, 0, 229, 0.4)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <PhoneAndroidIcon sx={{ 
                fontSize: 80, 
                color: '#1890ff', 
                mb: 2,
                filter: 'drop-shadow(0 0 10px rgba(255, 0, 229, 0.5))'
              }} />
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'white',
                mb: 2
              }}>
                {language === 'zh' ? '移动端' : 'Mobile'}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: theme.palette.text.secondary,
                mb: 3,
                lineHeight: 1.6
              }}>
                {language === 'zh' ? '随时随地使用，便携的移动应用体验' : 'Use anywhere, anytime with portable mobile experience'}
              </Typography>
              
              {/* Android版本 - 即将推出 */}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleDownload('android')}
                  startIcon={<AndroidIcon />}
                  disabled
                  sx={{
                    width: '100%',
                    py: 1.5,
                    mb: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {language === 'zh' ? 'Android 版本' : 'Android Version'}
                </Button>
                <Typography variant="caption" sx={{ 
                  color: theme.palette.text.secondary,
                  display: 'block'
                }}>
                  {language === 'zh' ? '即将推出' : 'Coming Soon'}
                </Typography>
              </Box>

              {/* iOS版本 - 即将推出 */}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleDownload('ios')}
                  startIcon={<AppleIcon />}
                  disabled
                  sx={{
                    width: '100%',
                    py: 1.5,
                    mb: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {language === 'zh' ? 'iOS 版本' : 'iOS Version'}
                </Button>
                <Typography variant="caption" sx={{ 
                  color: theme.palette.text.secondary,
                  display: 'block'
                }}>
                  {language === 'zh' ? '即将推出' : 'Coming Soon'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 系统要求和说明 */}
      <Paper sx={{
        mt: 6,
        p: 4,
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 229, 255, 0.1)',
        borderRadius: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        <Typography variant="h5" gutterBottom sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 600,
          mb: 3
        }}>
          {language === 'zh' ? '系统要求' : 'System Requirements'}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
              {language === 'zh' ? 'Windows 桌面端' : 'Windows Desktop'}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
              • {language === 'zh' ? '操作系统：Windows 10 或更高版本' : 'OS: Windows 10 or higher'}<br/>
              • {language === 'zh' ? '内存：至少 4GB RAM' : 'Memory: At least 4GB RAM'}<br/>
              • {language === 'zh' ? '存储空间：200MB 可用空间' : 'Storage: 200MB available space'}<br/>
              • {language === 'zh' ? '网络：需要互联网连接' : 'Network: Internet connection required'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
              {language === 'zh' ? '移动端' : 'Mobile'}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
              • {language === 'zh' ? 'Android：Android 8.0 或更高版本' : 'Android: Android 8.0 or higher'}<br/>
              • {language === 'zh' ? 'iOS：iOS 12.0 或更高版本' : 'iOS: iOS 12.0 or higher'}<br/>
              • {language === 'zh' ? '存储空间：100MB 可用空间' : 'Storage: 100MB available space'}<br/>
              • {language === 'zh' ? '网络：需要互联网连接' : 'Network: Internet connection required'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Download;