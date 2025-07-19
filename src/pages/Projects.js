import React, { useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Chip } from '@mui/material';
import { LanguageContext } from '../App';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';

function Projects() {
  const { language } = useContext(LanguageContext);

  const projects = [
    {
      id: 4,
      title: language === 'zh' ? '快手服务平台' : 'Kuaishou Service Platform',
      description: language === 'zh'
        ? '专业的快手推广和热度提升服务平台，提供多种服务选择和一站式解决方案。'
        : 'Professional Kuaishou promotion and popularity boost service platform, offering various service options and one-stop solutions.',
      image: '/images/123.png',
      technologies: ['React', 'Material-UI', 'Service API', 'Analytics'],
      liveUrl: '/kuaishou-service',
      githubUrl: '#',
      status: language === 'zh' ? '已完成' : 'Completed'
    },
    {
      id: 2,
      title: language === 'zh' ? 'AI 智能助手' : 'AI Smart Assistant',
      description: language === 'zh'
        ? '集成了先进AI技术的智能对话助手，支持多种对话模式和个性化定制。'
        : 'An intelligent conversational assistant integrated with advanced AI technology, supporting multiple conversation modes and personalized customization.',
      image: '/images/AI人偶.png',
      technologies: ['Python', 'TensorFlow', 'NLP', 'API'],
      liveUrl: '#',
      githubUrl: '#',
      status: language === 'zh' ? '开发中' : 'In Development'
    },
    {
      id: 3,
      title: language === 'zh' ? '桌面应用程序' : 'Desktop Application',
      description: language === 'zh'
        ? '跨平台桌面应用程序，提供丰富的功能和优秀的用户体验。'
        : 'Cross-platform desktop application providing rich functionality and excellent user experience.',
      image: '/images/123.png',
      technologies: ['Electron', 'Vue.js', 'SQLite', 'Node.js'],
      liveUrl: '/download',
      githubUrl: '#',
      status: language === 'zh' ? '已发布' : 'Released'
    }
  ];

  const getStatusColor = (status) => {
    if (status === '已完成' || status === 'Completed' || status === '已发布' || status === 'Released') {
      return 'success';
    } else if (status === '开发中' || status === 'In Development') {
      return 'warning';
    }
    return 'default';
  };

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          textAlign: 'center',
          mb: 4,
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #1890ff, #40a9ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {language === 'zh' ? '我的项目' : 'My Projects'}
      </Typography>
      
      <Typography 
        variant="subtitle1" 
        sx={{ 
          textAlign: 'center',
          mb: 6,
          color: 'text.secondary',
          maxWidth: '600px',
          mx: 'auto'
        }}
      >
        {language === 'zh' 
          ? '这里展示了我参与开发和设计的一些项目，涵盖了Web开发、AI技术和桌面应用等领域。'
          : 'Here are some projects I have been involved in developing and designing, covering areas such as web development, AI technology, and desktop applications.'}
      </Typography>

      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={project.id}>
            <Card 
              sx={{ 
                height: '100%',
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={project.image}
                alt={project.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {project.title}
                  </Typography>
                  <Chip 
                    label={project.status} 
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, flexGrow: 1 }}
                >
                  {project.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    {language === 'zh' ? '技术栈：' : 'Technologies:'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {project.technologies.map((tech, index) => (
                      <Chip 
                        key={index} 
                        label={tech} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  {project.liveUrl !== '#' && (
                    <Button 
                      variant="contained" 
                      size="small"
                      startIcon={<LaunchIcon />}
                      href={project.liveUrl}
                      target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
                      sx={{ flex: 1 }}
                    >
                      {language === 'zh' ? '查看项目' : 'View Project'}
                    </Button>
                  )}
                  {project.githubUrl !== '#' && (
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<GitHubIcon />}
                      href={project.githubUrl}
                      target="_blank"
                      sx={{ flex: 1 }}
                    >
                      {language === 'zh' ? '源码' : 'Source'}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Projects;