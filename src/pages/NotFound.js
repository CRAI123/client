import React, { useContext } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFound() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 8
        }}
      >
        <ErrorOutlineIcon 
          sx={{ 
            fontSize: 120, 
            color: 'rgba(99, 102, 241, 0.6)',
            mb: 3
          }} 
        />
        
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 2,
            color: '#1e293b',
            fontWeight: 600
          }}
        >
          {language === 'zh' ? '页面未找到' : 'Page Not Found'}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: '#64748b',
            maxWidth: '500px'
          }}
        >
          {language === 'zh' 
            ? '抱歉，您访问的页面不存在或您的设备不被支持。请检查URL或返回首页。'
            : 'Sorry, the page you are looking for does not exist or your device is not supported. Please check the URL or return to the homepage.'
          }
        </Typography>
        
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            color: 'white',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(90deg, #5855eb, #7c3aed)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {language === 'zh' ? '返回首页' : 'Back to Home'}
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;