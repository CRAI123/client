import React, { useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Button, CardActionArea, Chip, Stack, IconButton } from '@mui/material';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function Portfolio() {
  const { language } = useContext(LanguageContext);
  const { currentUser, isAuthenticated, addFavorite, removeFavorite } = useAuth();

  const handleToggleFavorite = (event, projectId) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      // 如果用户未登录，可以添加提示或跳转到登录页面
      return;
    }
    
    const isFavorited = currentUser?.favorites?.includes(projectId);
    if (isFavorited) {
      removeFavorite(projectId);
    } else {
      addFavorite(projectId);
    }
  };
  const [projects, setProjects] = React.useState([
    {
      id: 1,
      name: language === 'zh' ? 'AI生成人偶手办' : 'AI-generated figurines',
      description: language === 'zh' ? '使用GPT-4o和Tripo构建的AI人偶手办' : 'An AI puppet figure built using GPT-4o and Tripo',
      imageUrl: '/images/AI人偶.png',
      technologies: ['GPT-4o', 'Tripo'],
      githubUrl: 'https://blog.csdn.net/lcr557hcck/article/details/147165941?fromshare=blogdetail&sharetype=blogdetail&sharerId=147165941&sharerefer=PC&sharesource=lcr557hcck&sharefrom=from_link',
      demoUrl: 'https://your-website.com'
    },
    // 可以添加更多项目
  ]);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  React.useEffect(() => {
    const loadProjects = () => {
      try {
        // 从localStorage加载项目数据
        const savedProjects = JSON.parse(localStorage.getItem('projectData') || '[]');
        // 确保每个项目对象都有必要的属性
        const projectsWithDefaults = savedProjects.map(project => ({
          id: project.id || Date.now(),
          name: project.name || '',
          description: project.description || '',
          imageUrl: project.imageUrl || '/images/default-project.jpg',
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
          githubUrl: project.githubUrl || '',
          demoUrl: project.demoUrl || ''
        }));
        setProjects(projectsWithDefaults);
      } catch (error) {
        console.error('加载项目数据时出错:', error);
        // 如果加载失败，保持默认项目数据
        setProjects([{
          id: 1,
          name: language === 'zh' ? '个人网站' : 'Personal Website',
          description: language === 'zh' ? '使用React和Material-UI构建的响应式个人网站，支持中英文切换，包含作品集展示、资源分享等功能。' : 'A responsive personal website built with React and Material-UI, supporting Chinese/English switching, featuring portfolio showcase and resource sharing.',
          imageUrl: '/images/AI人偶.png',
          technologies: ['React', 'Material-UI', 'Node.js', 'Express'],
          githubUrl: 'https://blog.csdn.net/lcr557hcck/article/details/147165941?fromshare=blogdetail&sharetype=blogdetail&sharerId=147165941&sharerefer=PC&sharesource=lcr557hcck&sharefrom=from_link',
          demoUrl: 'https://your-website.com'
        }]);
      }
    };

    loadProjects();
    
    // 监听storage变化
    const handleStorageChange = (event) => {
      if (event.key === 'projectData') {
        loadProjects();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleLinkClick = (url, event) => {
    event.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          fontFamily: '"Orbitron", sans-serif',
          background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
        }}
      >
        {language === 'zh' ? '作品集' : 'Portfolio'}
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(30, 30, 30, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 5px 15px rgba(0, 229, 255, 0.2)'
              }
            }}>
              <CardActionArea onClick={() => handleOpenDialog(project)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={project.imageUrl || '/images/default-project.jpg'}
                  alt={project.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="div"
                    sx={{
                      color: '#00e5ff',
                      fontWeight: 500
                    }}
                  >
                    {project.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flex: 1 }}>
                      {project.technologies.map((tech, i) => (
                        <Chip
                          key={i}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                            color: '#00e5ff',
                            border: '1px solid rgba(0, 229, 255, 0.3)',
                            mt: 1
                          }}
                        />
                      ))}
                    </Stack>
                    <IconButton
                      onClick={(e) => handleToggleFavorite(e, project.id)}
                      sx={{
                        color: '#00e5ff',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 229, 255, 0.1)'
                        }
                      }}
                    >
                      {isAuthenticated && currentUser?.favorites?.includes(project.id) ? (
                        <StarIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '8px',
            color: 'white'
          }
        }}
      >
        {selectedProject && (
          <>
            <DialogTitle sx={{ 
              color: '#00e5ff',
              fontFamily: '"Orbitron", sans-serif' 
            }}>
              {selectedProject.name}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <img
                  src={selectedProject.imageUrl || '/images/default-project.jpg'}
                  alt={selectedProject.name}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#00e5ff' }}>
                {language === 'zh' ? '技术栈' : 'Technologies'}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                {selectedProject.technologies.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    sx={{
                      backgroundColor: 'rgba(0, 229, 255, 0.1)',
                      color: '#00e5ff',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      mb: 1
                    }}
                  />
                ))}
              </Stack>
              <Typography variant="h6" gutterBottom sx={{ color: '#00e5ff' }}>
                {language === 'zh' ? '项目描述' : 'Project Description'}
              </Typography>
              <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {selectedProject.description}
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                {selectedProject.githubUrl && (
                  <Button
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    onClick={(e) => handleLinkClick(selectedProject.githubUrl, e)}
                    sx={{
                      borderColor: 'rgba(0, 229, 255, 0.3)',
                      color: '#00e5ff',
                      '&:hover': {
                        borderColor: 'rgba(0, 229, 255, 0.5)',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)'
                      }
                    }}
                  >
                    GitHub
                  </Button>
                )}
                {selectedProject.demoUrl && (
                  <Button
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    onClick={(e) => handleLinkClick(selectedProject.demoUrl, e)}
                    sx={{
                      borderColor: 'rgba(0, 229, 255, 0.3)',
                      color: '#00e5ff',
                      '&:hover': {
                        borderColor: 'rgba(0, 229, 255, 0.5)',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)'
                      }
                    }}
                  >
                    {language === 'zh' ? '在线演示' : 'Live Demo'}
                  </Button>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDialog}
                sx={{
                  color: '#00e5ff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 229, 255, 0.1)'
                  }
                }}
              >
                {language === 'zh' ? '关闭' : 'Close'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Portfolio;