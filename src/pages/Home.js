import React, { useContext } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import { LanguageContext } from '../App';
import Chat from '../components/Chat';

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { language } = useContext(LanguageContext);
  
  return (
    <Box sx={{ mt: 4 }}>
      {/* 背景几何图形装饰 */}
      <Box sx={{ 
        position: 'absolute', 
        top: '15%', 
        right: '5%', 
        width: '200px', 
        height: '200px', 
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
        width: '150px', 
        height: '150px', 
        border: '1px solid rgba(255, 0, 229, 0.2)', 
        borderRadius: '50%',
        opacity: 0.3,
        zIndex: 0
      }} />
      
      {/* 主要内容 */}
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
            background: 'linear-gradient(90deg, #1890ff, #40a9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
            mb: 2
          }}
        >
          {language === 'zh' ? '欢迎来到CR Studio' : 'Welcome to CR Studio'}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 2, 
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            mx: 'auto',
            letterSpacing: '0.03em',
            lineHeight: 1.6
          }}
        >
          {language === 'zh' ? 'CR Studio - 专业的创意工作室，提供优质的数字内容创作服务' : 'CR Studio - Professional creative studio offering high-quality digital content creation services'}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            color: theme.palette.text.secondary,
            maxWidth: '700px',
            mx: 'auto',
            letterSpacing: '0.02em',
            lineHeight: 1.5,
            opacity: 0.8
          }}
        >
          {language === 'zh' ? '在CR Studio，我们专注于创新技术、资源分享和专业服务，为客户提供全方位的数字化解决方案' : 'At CR Studio, we focus on innovative technology, resource sharing, and professional services, providing comprehensive digital solutions for our clients'}
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/about')}
          sx={{ 
            mr: 2,
            px: 3,
            py: 1.2,
            borderRadius: '4px',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)'
          }}
          startIcon={<CodeIcon />}
        >
          {language === 'zh' ? '关于我' : 'About Me'}
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/portfolio')}
          sx={{ 
            px: 3,
            py: 1.2,
            borderRadius: '4px',
            borderColor: theme.palette.primary.main,
            '&:hover': {
              boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)'
            }
          }}
          startIcon={<TerminalIcon />}
        >
          {language === 'zh' ? '作品集' : 'Portfolio'}
        </Button>
      </Box>
      
      {/* AI对话组件 */}
      <Chat />
    </Box>
  );
}

export default Home;