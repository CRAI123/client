import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Chip, IconButton, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';

export default function Resources() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { currentUser, isAuthenticated, addFavorite, removeFavorite, isFavorite } = useAuth();

  // 检查用户是否已登录，如果未登录则重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  const [resources, setResources] = useState([]);
  const [favoriteChanged, setFavoriteChanged] = useState(false);
  
  // 初始资源数据
  const initialResources = {
    article: [
      { 
        id: 1, 
        title: "ChatGPT + Tripo = 王炸", 
        description: "GPT-4o + Tripo 生成3D手办，从此解放双手\n\n## 目录\n一、ChatGPT 镜像网站\n二、ChatGPT生成人偶图片\n三、tripo生成3D模型\n\n注：可以找作者打印模型哦！\n\n## 详细步骤\n\n### 1. 使用ChatGPT生成创意\n首先，我们需要使用ChatGPT来生成人偶的创意和描述。可以输入类似'设计一个可爱的卡通人偶'的提示词。\n\n### 2. 生成图片\n根据ChatGPT的描述，使用AI图片生成工具创建人偶的2D图像。\n\n### 3. 转换为3D模型\n使用Tripo AI将2D图片转换为3D模型，这个过程通常只需要几分钟。\n\n### 4. 3D打印\n最后，将生成的3D模型文件用于3D打印，制作出实体手办。\n\n这个流程大大简化了传统的手办制作过程，让普通用户也能轻松创作出个性化的3D手办。", 
        link: "https://blog.csdn.net/lcr557hcck/article/details/147165941?fromshare=blogdetail&sharetype=blogdetail&sharerId=147165941&sharerefer=PC&sharesource=lcr557hcck&sharefrom=from_link", 
        category: "article" 
      },

    ]
  };
  
  // 从localStorage加载资源数据
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
          // 如果没有存储的数据，使用初始数据
          setResources(initialResources);
        }
      } catch (error) {
        console.error('加载资源数据时出错:', error);
        // 出错时使用初始数据
        setResources(initialResources);
      }
    };
    
    // 加载数据
    loadResourcesData();
    
    // 添加storage事件监听器，当localStorage变化时更新数据
    const handleStorageChange = (event) => {
      if (event.key === 'resourceData') {
        loadResourcesData();
      }
    };
    
    // 添加事件监听
    window.addEventListener('storage', handleStorageChange);
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 处理资源点击事件 - 在当前页面显示内容
  const [selectedResource, setSelectedResource] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setShowContent(true);
  };
  
  // 返回资源列表
  const handleBackToList = () => {
    setShowContent(false);
    setSelectedResource(null);
    setIsFullscreen(false);
  };

  // 切换全屏显示
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // 处理收藏/取消收藏
  const handleToggleFavorite = (event, resourceId) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      // 如果未登录，跳转到登录页面
      navigate('/login');
      return;
    }
    
    if (isFavorite(resourceId)) {
      removeFavorite(resourceId);
    } else {
      addFavorite(resourceId);
    }
    
    // 更新状态触发重新渲染
    setFavoriteChanged(!favoriteChanged);
  };
  
  // 根据分类对资源进行分组
  const getResourcesByCategory = () => {
    if (!resources || resources.length === 0) {
      return {};
    }
    
    // 将资源按分类分组
    const groupedResources = {};
    
    Object.values(resources).flat().forEach(resource => {
      if (!groupedResources[resource.category]) {
        groupedResources[resource.category] = [];
      }
      groupedResources[resource.category].push(resource);
    });
    
    return groupedResources;
  };
  
  // 获取分组后的资源
  const groupedResources = getResourcesByCategory();
  const categories = Object.keys(groupedResources);
  
  // 分类名称映射
  const categoryNames = {
    article: language === 'zh' ? '技术文章' : 'Technical Articles',
    note: language === 'zh' ? '学习笔记' : 'Study Notes'
  };
  
  // 如果显示内容，渲染资源详情页面
  if (showContent && selectedResource) {
    return (
        <Box sx={{ 
          mt: isFullscreen ? 1 : 4, 
          maxWidth: isFullscreen ? '100%' : '1600px', 
          mx: 'auto', 
          px: isFullscreen ? 1 : 2,
          transition: 'all 0.3s ease'
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleBackToList} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            {selectedResource.title}
          </Typography>
          <IconButton 
            onClick={handleToggleFullscreen}
            sx={{ ml: 1 }}
            title={isFullscreen ? '退出全屏' : '全屏显示'}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton 
            onClick={() => window.open(selectedResource.link, '_blank')}
            sx={{ ml: 1 }}
          >
            <LinkIcon />
          </IconButton>
        </Box>
        
        <Paper elevation={3} sx={{ 
           p: isFullscreen ? 2 : 4, 
           maxWidth: isFullscreen ? '100%' : '1400px', 
           mx: 'auto', 
           width: '100%',
           transition: 'all 0.3s ease'
         }}>
          
          <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
            {selectedResource.description}
          </Typography>
          
          {selectedResource.link && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {language === 'zh' ? '原文链接' : 'Original Link'}:
              </Typography>
              <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {selectedResource.link}
                </Typography>
              </Paper>
              <iframe 
                 src={selectedResource.link}
                 width={isFullscreen ? '100%' : '1200px'}
                 height={isFullscreen ? '90vh' : '800px'}
                 style={{
                   border: '4px solid #333',
                   borderRadius: '12px',
                   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                   transition: 'all 0.3s ease',
                   marginTop: '16px'
                 }}
                 title={selectedResource.title}
                />
            </Box>
          )}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, maxWidth: '1600px', mx: 'auto', px: 2 }}>
      <Typography variant="h4" gutterBottom>
        {language === 'zh' ? '资料分享' : 'Resources'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {categories.length > 0 ? (
        categories.map(category => (
          <Paper elevation={3} sx={{ p: 3, mt: 3 }} key={category}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {categoryNames[category] || category}
              </Typography>
              <Chip 
                label={`${groupedResources[category].length}`} 
                size="small" 
                color="primary" 
                sx={{ ml: 2 }} 
              />
            </Box>
            <List>
              {groupedResources[category].map((resource) => (
                <React.Fragment key={resource.id}>
                  <ListItem 
                    button 
                    onClick={() => handleResourceClick(resource)}
                    secondaryAction={
                      <Tooltip title={language === 'zh' ? (isFavorite(resource.id) ? '取消收藏' : '收藏') : (isFavorite(resource.id) ? 'Remove from favorites' : 'Add to favorites')}>
                        <IconButton 
                          edge="end" 
                          aria-label="favorite"
                          onClick={(event) => handleToggleFavorite(event, resource.id)}
                          sx={{ color: isFavorite(resource.id) ? '#00e5ff' : 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {isFavorite(resource.id) ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText 
                      primary={resource.title} 
                      secondary={resource.description} 
                    />
                  </ListItem>
                  {resource.id !== groupedResources[category][groupedResources[category].length - 1].id && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        ))
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            {language === 'zh' ? '暂无资源' : 'No resources available'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}