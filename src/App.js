import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box, useTheme, IconButton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import ArticleDetail from './pages/ArticleDetail';
import Admin from './pages/Admin';
import Footer from './components/Footer';

// 创建语言上下文
export const LanguageContext = createContext();

function App() {
  const theme = useTheme();
  const [language, setLanguage] = useState('zh'); // 默认中文
  
  // 切换语言函数
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <Router>
        <Box sx={{ 
          background: 'linear-gradient(to right, #121212, #1e1e1e)',
          minHeight: '100vh',
          backgroundSize: 'cover',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none',
          }
        }}>
        <AppBar position="static" elevation={0} sx={{ 
          background: 'linear-gradient(90deg, rgba(18,18,18,0.9) 0%, rgba(30,30,30,0.9) 100%)',
          borderBottom: '1px solid rgba(0, 229, 255, 0.2)'
        }}>
          <Toolbar>
            <CodeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="div" sx={{ 
              flexGrow: 1, 
              fontFamily: '"Orbitron", sans-serif',
              letterSpacing: '0.05em',
              background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
            }}>
              CR Studio
            </Typography>
            <Button color="primary" href="/" sx={{ mx: 0.8 }}>{language === 'zh' ? '首页' : 'Home'}</Button>
            <Button color="primary" href="/about" sx={{ mx: 0.8 }}>{language === 'zh' ? '关于我' : 'About'}</Button>
            <Button color="primary" href="/portfolio" sx={{ mx: 0.8 }}>{language === 'zh' ? '作品集' : 'Portfolio'}</Button>
            <Button color="primary" href="/resources" sx={{ mx: 0.8 }}>{language === 'zh' ? '资料分享' : 'Resources'}</Button>
            <Button color="primary" href="/contact" sx={{ mx: 0.8 }}>{language === 'zh' ? '联系方式' : 'Contact'}</Button>
            
            
            <IconButton 
              color="primary" 
              onClick={toggleLanguage}
              sx={{ 
                ml: 1, 
                border: '1px solid rgba(0, 229, 255, 0.3)',
                '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.1)' }
              }}
            >
              <TranslateIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ 
          mt: 4,
          position: 'relative',
          zIndex: 1,
          flex: '1 0 auto',
          mb: 4
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/article/:category/:id" element={<ArticleDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </Router>
    </LanguageContext.Provider>
  );
}

export default App;
