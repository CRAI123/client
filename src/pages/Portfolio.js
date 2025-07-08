import React, { useContext, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Button, CardActionArea, Chip, Stack, IconButton, Tabs, Tab } from '@mui/material';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArticleIcon from '@mui/icons-material/Article';

function Portfolio() {
  const { language } = useContext(LanguageContext);
  const { currentUser, isAuthenticated, addFavorite, removeFavorite } = useAuth();
  const navigate = useNavigate();

  // 检查用户是否已登录，如果未登录则重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
      demoUrl: 'https://your-website.com',
      articleContent: language === 'zh' ? 
        `# AI生成人偶手办制作全流程\n\n## 项目概述\n\n本项目使用最新的AI技术栈，结合GPT-4o的强大语言理解能力和Tripo的3D建模技术，实现了从概念到实体的AI人偶手办制作全流程。\n\n## 技术实现\n\n### 1. 概念设计阶段\n- 使用GPT-4o进行角色设定和外观描述\n- 生成详细的人物特征和风格定义\n- 优化提示词以获得最佳的视觉效果\n\n### 2. 3D建模阶段\n- 利用Tripo平台的AI建模能力\n- 从2D概念图生成高质量3D模型\n- 细节优化和材质调整\n\n### 3. 后期处理\n- 模型优化和细节完善\n- 支撑结构设计\n- 3D打印准备\n\n## 项目特色\n\n1. **全AI驱动**: 从设计到建模全程使用AI技术\n2. **高度定制化**: 可根据需求生成独特的人偶设计\n3. **快速迭代**: 大幅缩短传统手办制作周期\n4. **成本效益**: 降低了专业建模的技术门槛\n\n## 技术难点与解决方案\n\n### 难点1: 提示词优化\n传统的文本描述往往无法准确传达设计意图，需要通过多轮迭代优化提示词。\n\n**解决方案**: 建立了一套标准化的提示词模板，包含角色基本信息、外观特征、风格偏好等关键要素。\n\n### 难点2: 3D模型质量控制\nAI生成的3D模型可能存在拓扑结构不合理、细节缺失等问题。\n\n**解决方案**: 采用分层建模策略，先生成基础形状，再逐步添加细节，确保模型的可打印性。\n\n## 成果展示\n\n最终制作的AI人偶手办具有以下特点：\n- 高度还原设计概念\n- 细节丰富，质感真实\n- 结构稳定，适合收藏展示\n- 制作周期短，成本可控\n\n## 未来展望\n\n1. **技术升级**: 集成更先进的AI模型，提升生成质量\n2. **流程自动化**: 开发一键式生成工具，降低使用门槛\n3. **材质创新**: 探索新型3D打印材料，提升手办质感\n4. **个性化定制**: 开发用户友好的定制界面\n\n## 总结\n\n本项目成功验证了AI技术在创意产业中的应用潜力，为传统手办制作行业带来了新的可能性。通过技术创新和流程优化，我们实现了高质量、低成本、快速交付的AI手办制作解决方案。` :
        `# AI-Generated Figurine Creation Process\n\n## Project Overview\n\nThis project utilizes cutting-edge AI technology stack, combining GPT-4o's powerful language understanding capabilities with Tripo's 3D modeling technology to achieve a complete workflow from concept to physical AI figurine creation.\n\n## Technical Implementation\n\n### 1. Concept Design Phase\n- Use GPT-4o for character setting and appearance description\n- Generate detailed character features and style definitions\n- Optimize prompts for best visual effects\n\n### 2. 3D Modeling Phase\n- Utilize Tripo platform's AI modeling capabilities\n- Generate high-quality 3D models from 2D concept art\n- Detail optimization and material adjustment\n\n### 3. Post-processing\n- Model optimization and detail refinement\n- Support structure design\n- 3D printing preparation\n\n## Project Features\n\n1. **Fully AI-driven**: Complete AI technology from design to modeling\n2. **Highly customizable**: Generate unique figurine designs based on requirements\n3. **Rapid iteration**: Significantly reduce traditional figurine production cycle\n4. **Cost-effective**: Lower technical barriers for professional modeling\n\n## Technical Challenges and Solutions\n\n### Challenge 1: Prompt Optimization\nTraditional text descriptions often fail to accurately convey design intent, requiring multiple iterations to optimize prompts.\n\n**Solution**: Established a standardized prompt template including character basic information, appearance features, style preferences and other key elements.\n\n### Challenge 2: 3D Model Quality Control\nAI-generated 3D models may have issues like unreasonable topology and missing details.\n\n**Solution**: Adopted layered modeling strategy, first generating basic shapes, then gradually adding details to ensure model printability.\n\n## Results\n\nThe final AI figurine features:\n- High fidelity to design concept\n- Rich details with realistic texture\n- Stable structure suitable for collection and display\n- Short production cycle with controllable costs\n\n## Future Prospects\n\n1. **Technology Upgrade**: Integrate more advanced AI models to improve generation quality\n2. **Process Automation**: Develop one-click generation tools to lower usage barriers\n3. **Material Innovation**: Explore new 3D printing materials to enhance figurine texture\n4. **Personalized Customization**: Develop user-friendly customization interface\n\n## Conclusion\n\nThis project successfully validates the application potential of AI technology in creative industries, bringing new possibilities to the traditional figurine manufacturing industry. Through technological innovation and process optimization, we achieved a high-quality, low-cost, fast-delivery AI figurine creation solution.`
    },
    {
      id: 2,
      name: language === 'zh' ? '智能个人网站系统' : 'Intelligent Personal Website System',
      description: language === 'zh' ? '基于React和Node.js构建的全栈个人网站，集成AI聊天、VIP管理等功能' : 'A full-stack personal website built with React and Node.js, featuring AI chat and VIP management',
      imageUrl: '/images/123.png',
      technologies: ['React', 'Node.js', 'Material-UI', 'PostgreSQL', 'AI Integration'],
      githubUrl: 'https://github.com/your-username/personal-website',
      demoUrl: 'https://your-website.com',
      articleContent: language === 'zh' ? 
        `# 智能个人网站系统开发全记录\n\n## 项目背景\n\n在数字化时代，拥有一个功能完善的个人网站已成为展示个人能力和作品的重要平台。本项目旨在构建一个集成多种现代技术的智能个人网站系统。\n\n## 技术架构\n\n### 前端技术栈\n- **React 18**: 采用最新的React框架，利用函数组件和Hooks\n- **Material-UI**: 提供现代化的UI组件库\n- **React Router**: 实现单页应用的路由管理\n- **Context API**: 全局状态管理\n\n### 后端技术栈\n- **Node.js**: 服务器端JavaScript运行环境\n- **Express.js**: 轻量级Web应用框架\n- **PostgreSQL**: 关系型数据库管理系统\n- **JWT**: 用户认证和授权\n\n## 核心功能模块\n\n### 1. 用户认证系统\n- 用户注册和登录\n- JWT令牌管理\n- 权限控制和路由保护\n- 用户资料管理\n\n### 2. 作品展示模块\n- 响应式作品集展示\n- 项目详情对话框\n- 技术标签分类\n- 收藏功能\n- 原文阅读功能\n\n### 3. AI聊天助手\n- 集成第三方AI API\n- 实时对话功能\n- 聊天历史记录\n- 智能回复建议\n\n### 4. VIP管理系统\n- VIP密钥生成和验证\n- 批量密钥创建\n- 有效期管理\n- 使用统计分析\n\n### 5. 资源分享平台\n- 文件上传和下载\n- 分类管理\n- 搜索功能\n- 访问权限控制\n\n## 技术亮点\n\n### 1. 响应式设计\n采用Material-UI的Grid系统和断点机制，确保网站在各种设备上都有良好的显示效果。\n\n### 2. 主题定制\n实现了深色主题和科技感设计，使用青色作为主色调，营造现代化的视觉体验。\n\n### 3. 数据库设计\n设计了完整的数据库架构，包括用户表、项目表、VIP密钥表等，支持数据的持久化存储。\n\n### 4. 安全性考虑\n- 密码加密存储\n- SQL注入防护\n- XSS攻击防护\n- CSRF令牌验证\n\n## 开发挑战与解决方案\n\n### 挑战1: 状态管理复杂性\n随着功能模块增加，组件间的状态共享变得复杂。\n\n**解决方案**: 采用React Context API结合useReducer，创建了统一的状态管理系统。\n\n### 挑战2: 数据库连接优化\n初期数据库连接存在性能问题和连接池管理不当。\n\n**解决方案**: 实现了连接池管理，添加了连接状态监控和自动重连机制。\n\n### 挑战3: 用户体验优化\n页面加载速度和交互响应需要进一步优化。\n\n**解决方案**: 实现了懒加载、代码分割和缓存策略，显著提升了用户体验。\n\n## 性能优化\n\n1. **代码分割**: 使用React.lazy()实现路由级别的代码分割\n2. **图片优化**: 实现图片懒加载和格式优化\n3. **缓存策略**: 合理使用浏览器缓存和服务端缓存\n4. **数据库优化**: 添加索引和查询优化\n\n## 部署与运维\n\n### 部署架构\n- 前端: 静态文件部署到CDN\n- 后端: Node.js应用部署到云服务器\n- 数据库: 使用云数据库服务\n\n### 监控与维护\n- 应用性能监控\n- 错误日志收集\n- 自动化备份\n- 安全更新管理\n\n## 未来规划\n\n1. **移动端适配**: 开发React Native移动应用\n2. **AI功能增强**: 集成更多AI服务，如图像识别、语音交互\n3. **社交功能**: 添加评论、点赞、分享等社交元素\n4. **数据分析**: 实现用户行为分析和网站统计\n5. **国际化**: 支持多语言切换\n\n## 总结\n\n本项目成功构建了一个功能完善的智能个人网站系统，不仅展示了现代Web开发的最佳实践，还集成了AI技术和先进的用户管理功能。通过持续的优化和迭代，该系统为个人品牌建设和技术展示提供了强有力的平台支持。` :
        `# Intelligent Personal Website System Development Record\n\n## Project Background\n\nIn the digital age, having a fully functional personal website has become an important platform for showcasing personal abilities and works. This project aims to build an intelligent personal website system that integrates various modern technologies.\n\n## Technical Architecture\n\n### Frontend Technology Stack\n- **React 18**: Latest React framework using functional components and Hooks\n- **Material-UI**: Modern UI component library\n- **React Router**: Single-page application routing management\n- **Context API**: Global state management\n\n### Backend Technology Stack\n- **Node.js**: Server-side JavaScript runtime environment\n- **Express.js**: Lightweight web application framework\n- **PostgreSQL**: Relational database management system\n- **JWT**: User authentication and authorization\n\n## Core Functional Modules\n\n### 1. User Authentication System\n- User registration and login\n- JWT token management\n- Permission control and route protection\n- User profile management\n\n### 2. Portfolio Display Module\n- Responsive portfolio showcase\n- Project detail dialogs\n- Technology tag classification\n- Favorite functionality\n- Article reading feature\n\n### 3. AI Chat Assistant\n- Third-party AI API integration\n- Real-time conversation functionality\n- Chat history records\n- Intelligent reply suggestions\n\n### 4. VIP Management System\n- VIP key generation and validation\n- Batch key creation\n- Validity period management\n- Usage statistics analysis\n\n### 5. Resource Sharing Platform\n- File upload and download\n- Category management\n- Search functionality\n- Access permission control\n\n## Technical Highlights\n\n### 1. Responsive Design\nUtilizes Material-UI's Grid system and breakpoint mechanisms to ensure excellent display on various devices.\n\n### 2. Theme Customization\nImplemented dark theme and tech-style design using cyan as the primary color to create a modern visual experience.\n\n### 3. Database Design\nDesigned complete database architecture including user tables, project tables, VIP key tables, etc., supporting persistent data storage.\n\n### 4. Security Considerations\n- Password encryption storage\n- SQL injection protection\n- XSS attack prevention\n- CSRF token validation\n\n## Development Challenges and Solutions\n\n### Challenge 1: State Management Complexity\nAs functional modules increased, state sharing between components became complex.\n\n**Solution**: Adopted React Context API combined with useReducer to create a unified state management system.\n\n### Challenge 2: Database Connection Optimization\nInitial database connections had performance issues and improper connection pool management.\n\n**Solution**: Implemented connection pool management, added connection status monitoring and automatic reconnection mechanisms.\n\n### Challenge 3: User Experience Optimization\nPage loading speed and interaction responsiveness needed further optimization.\n\n**Solution**: Implemented lazy loading, code splitting, and caching strategies, significantly improving user experience.\n\n## Performance Optimization\n\n1. **Code Splitting**: Used React.lazy() for route-level code splitting\n2. **Image Optimization**: Implemented image lazy loading and format optimization\n3. **Caching Strategy**: Proper use of browser cache and server-side cache\n4. **Database Optimization**: Added indexes and query optimization\n\n## Deployment and Operations\n\n### Deployment Architecture\n- Frontend: Static files deployed to CDN\n- Backend: Node.js application deployed to cloud server\n- Database: Using cloud database service\n\n### Monitoring and Maintenance\n- Application performance monitoring\n- Error log collection\n- Automated backup\n- Security update management\n\n## Future Plans\n\n1. **Mobile Adaptation**: Develop React Native mobile application\n2. **AI Feature Enhancement**: Integrate more AI services like image recognition, voice interaction\n3. **Social Features**: Add comments, likes, sharing and other social elements\n4. **Data Analytics**: Implement user behavior analysis and website statistics\n5. **Internationalization**: Support multi-language switching\n\n## Conclusion\n\nThis project successfully built a fully functional intelligent personal website system that not only demonstrates modern web development best practices but also integrates AI technology and advanced user management features. Through continuous optimization and iteration, this system provides strong platform support for personal branding and technical showcase.`
    },
    // 可以添加更多项目
  ]);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogTab, setDialogTab] = React.useState(0);

  const handleOpenDialog = (project, tab = 0) => {
    setSelectedProject(project);
    setDialogTab(tab);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogTab(0);
  };

  const handleTabChange = (event, newValue) => {
    setDialogTab(newValue);
  };

  const handleReadArticle = (event, project) => {
    event.stopPropagation();
    handleOpenDialog(project, 1);
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
          background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
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
                      color: '#1890ff',
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
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    {project.technologies.map((tech, i) => (
                      <Chip
                        key={i}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0, 229, 255, 0.1)',
                          color: '#1890ff',
                          border: '1px solid rgba(0, 229, 255, 0.3)',
                          mt: 1
                        }}
                      />
                    ))}
                  </Stack>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {project.articleContent && (
                      <Button
                        size="small"
                        startIcon={<ArticleIcon />}
                        onClick={(e) => handleReadArticle(e, project)}
                        sx={{
                          color: '#1890ff',
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                            borderColor: 'rgba(0, 229, 255, 0.5)'
                          }
                        }}
                        variant="outlined"
                      >
                        {language === 'zh' ? '原文阅读' : 'Read Article'}
                      </Button>
                    )}
                    <IconButton
                      onClick={(e) => handleToggleFavorite(e, project.id)}
                      sx={{
                        color: '#1890ff',
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
              color: '#1890ff',
              fontFamily: '"Orbitron", sans-serif',
              pb: 0
            }}>
              {selectedProject.name}
            </DialogTitle>
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(0, 229, 255, 0.2)', px: 3 }}>
              <Tabs 
                value={dialogTab} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-selected': {
                      color: '#00e5ff'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#1890ff'
                  }
                }}
              >
                <Tab label={language === 'zh' ? '项目详情' : 'Project Details'} />
                {selectedProject.articleContent && (
                  <Tab label={language === 'zh' ? '原文阅读' : 'Article'} />
                )}
              </Tabs>
            </Box>
            <DialogContent>
              {dialogTab === 0 && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <img
                      src={selectedProject.imageUrl || '/images/default-project.jpg'}
                      alt={selectedProject.name}
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1890ff' }}>
                    {language === 'zh' ? '技术栈' : 'Technologies'}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                    {selectedProject.technologies.map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        sx={{
                          backgroundColor: 'rgba(0, 229, 255, 0.1)',
                          color: '#1890ff',
                          border: '1px solid rgba(0, 229, 255, 0.3)',
                          mb: 1
                        }}
                      />
                    ))}
                  </Stack>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1890ff' }}>
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
                          color: '#1890ff',
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
                          color: '#1890ff',
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
                </>
              )}
              {dialogTab === 1 && selectedProject.articleContent && (
                <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                  <Typography 
                    component="div"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.8,
                      '& h1': {
                        color: '#1890ff',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        mb: 2,
                        mt: 3
                      },
                      '& h2': {
                        color: '#1890ff',
                        fontSize: '1.3rem',
                        fontWeight: 500,
                        mb: 1.5,
                        mt: 2.5
                      },
                      '& h3': {
                        color: '#1890ff',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        mb: 1,
                        mt: 2
                      },
                      '& p': {
                        mb: 1.5
                      },
                      '& strong': {
                        color: '#1890ff',
                        fontWeight: 600
                      },
                      '& ul, & ol': {
                        pl: 2,
                        mb: 1.5
                      },
                      '& li': {
                        mb: 0.5
                      }
                    }}
                  >
                    {selectedProject.articleContent.split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <Typography key={index} variant="h1" component="h1">{line.substring(2)}</Typography>;
                      } else if (line.startsWith('## ')) {
                        return <Typography key={index} variant="h2" component="h2">{line.substring(3)}</Typography>;
                      } else if (line.startsWith('### ')) {
                        return <Typography key={index} variant="h3" component="h3">{line.substring(4)}</Typography>;
                      } else if (line.startsWith('**') && line.endsWith('**')) {
                        return <Typography key={index} component="p"><strong>{line.substring(2, line.length - 2)}</strong></Typography>;
                      } else if (line.trim() === '') {
                        return <Box key={index} sx={{ height: '0.5rem' }} />;
                      } else {
                        return <Typography key={index} component="p">{line}</Typography>;
                      }
                    })}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDialog}
                sx={{
                  color: '#1890ff',
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