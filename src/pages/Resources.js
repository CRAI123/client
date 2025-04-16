import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';

export default function Resources() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const [resources, setResources] = useState([]);
  
  // 初始资源数据
  const initialResources = {
    article: [
      { id: 1, title: "React Hooks 完全指南", description: "React Hooks是React 16.8引入的新特性，它允许在不编写类组件的情况下使用状态和其他React特性...", link: "https://example.com/article1", category: "article" },
      { id: 2, title: "Node.js 性能优化指南", description: "Node.js作为一个高性能的JavaScript运行时环境，有很多优化技巧可以提升应用性能...", link: "https://example.com/article2", category: "article" }
    ],
    note: [
      { id: 3, title: "JavaScript 高级程序设计笔记", description: "《JavaScript高级程序设计》是前端开发者必读的经典书籍，本文整理了学习笔记...", link: "https://example.com/note1", category: "note" },
      { id: 4, title: "数据结构与算法总结", description: "数据结构与算法是计算机科学的基础，掌握它们对提升编程能力至关重要...", link: "https://example.com/note2", category: "note" }
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
          setResources(initialResources.article.concat(initialResources.note));
        }
      } catch (error) {
        console.error('加载资源数据时出错:', error);
        // 出错时使用初始数据
        setResources(initialResources.article.concat(initialResources.note));
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
  
  // 处理资源点击事件
  const handleResourceClick = (link) => {
    window.open(link, '_blank');
  };
  
  // 根据分类对资源进行分组
  const getResourcesByCategory = () => {
    if (!resources || resources.length === 0) {
      return {};
    }
    
    // 将资源按分类分组
    const groupedResources = {};
    
    resources.forEach(resource => {
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
  
  return (
    <Box sx={{ mt: 4 }}>
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
                  <ListItem button onClick={() => handleResourceClick(resource.link)}>
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