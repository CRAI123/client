import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, IconButton, Chip, Tab, Tabs, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Profile() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { currentUser, isAuthenticated, removeFavorite } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [resources, setResources] = useState([]);
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // 加载所有资源数据
  useEffect(() => {
    const loadResourcesData = () => {
      try {
        // 从localStorage获取资源数据
        const storedResources = localStorage.getItem('resourceData');
        
        if (storedResources) {
          // 解析存储的数据
          const parsedResources = JSON.parse(storedResources);
          setResources(parsedResources);
        } else {
          setResources([]);
        }
      } catch (error) {
        console.error('加载资源数据时出错:', error);
        setResources([]);
      }
    };
    
    loadResourcesData();
  }, []);
  
  // 处理标签页变化
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // 处理资源点击事件
  const handleResourceClick = (link) => {
    window.open(link, '_blank');
  };
  
  // 处理取消收藏
  const handleRemoveFavorite = (resourceId) => {
    removeFavorite(resourceId);
  };
  
  // 获取用户收藏的资源
  const getFavoriteResources = () => {
    if (!currentUser || !currentUser.favorites || !resources.length) {
      return [];
    }
    
    return resources.filter(resource => 
      currentUser.favorites.includes(resource.id)
    );
  };
  
  // 获取用户收藏的资源
  const favoriteResources = getFavoriteResources();
  
  // 分类名称映射
  const categoryNames = {
    article: language === 'zh' ? '技术文章' : 'Technical Articles',
    note: language === 'zh' ? '学习笔记' : 'Study Notes'
  };
  
  // 用户注册时间
  const getRegistrationDate = () => {
    if (!currentUser || !currentUser.createdAt) return '';
    
    const date = new Date(currentUser.createdAt);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US');
  };
  
  if (!isAuthenticated) {
    return null; // 未登录时不渲染内容，等待重定向
  }
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          fontFamily: '"Orbitron", sans-serif',
          background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
        }}
      >
        <AccountCircleIcon sx={{ mr: 1, color: '#00e5ff' }} />
        {language === 'zh' ? '个人中心' : 'Profile'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {/* 用户信息卡片 */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '8px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'rgba(0, 229, 255, 0.7)' }} />
          <Box>
            <Typography variant="h6">{currentUser.username}</Typography>
            <Typography variant="body2" color="text.secondary">{currentUser.email}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {language === 'zh' ? '注册时间' : 'Registered on'}: {getRegistrationDate()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon sx={{ color: 'rgba(0, 229, 255, 0.7)', mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {language === 'zh' ? '收藏数量' : 'Favorites'}: {favoriteResources.length}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* 标签页 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab 
            label={language === 'zh' ? '收藏的资源' : 'Favorites'} 
            sx={{ 
              '&.Mui-selected': {
                color: '#00e5ff',
              }
            }}
          />
        </Tabs>
      </Box>
      
      {/* 收藏的资源列表 */}
      {tabValue === 0 && (
        <Box>
          {favoriteResources.length > 0 ? (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                background: 'rgba(30, 30, 30, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                borderRadius: '8px',
              }}
            >
              <List>
                {favoriteResources.map((resource) => (
                  <React.Fragment key={resource.id}>
                    <ListItem 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        py: 2
                      }}
                    >
                      <Box 
                        onClick={() => handleResourceClick(resource.link)}
                        sx={{ 
                          flex: 1, 
                          cursor: 'pointer',
                          '&:hover': { color: '#00e5ff' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle1">{resource.title}</Typography>
                          <Chip 
                            label={categoryNames[resource.category] || resource.category} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              backgroundColor: 'rgba(0, 229, 255, 0.1)',
                              border: '1px solid rgba(0, 229, 255, 0.3)',
                              color: '#00e5ff'
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {resource.description}
                        </Typography>
                      </Box>
                      <IconButton 
                        onClick={() => handleRemoveFavorite(resource.id)}
                        sx={{ 
                          color: '#00e5ff',
                          ml: { xs: 0, sm: 2 },
                          mt: { xs: 1, sm: 0 },
                          alignSelf: { xs: 'flex-end', sm: 'center' }
                        }}
                      >
                        <StarIcon />
                      </IconButton>
                    </ListItem>
                    {resource.id !== favoriteResources[favoriteResources.length - 1].id && 
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <Alert 
              severity="info" 
              sx={{ 
                background: 'rgba(30, 30, 30, 0.8)',
                color: 'white',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}
            >
              {language === 'zh' ? '你还没有收藏任何资源' : 'You haven\'t favorited any resources yet'}
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
}