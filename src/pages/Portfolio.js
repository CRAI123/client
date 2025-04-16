import React, { useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Button, CardActionArea } from '@mui/material';
import { LanguageContext } from '../App';

function Portfolio() {
  const { language } = useContext(LanguageContext);
  const [projects, setProjects] = React.useState([]);
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
    // 从localStorage加载项目数据
    const savedProjects = JSON.parse(localStorage.getItem('projectData') || '[]');
    setProjects(savedProjects);
    
    // 监听storage变化
    const handleStorageChange = (event) => {
      if (event.key === 'projectData') {
        const updatedProjects = JSON.parse(event.newValue || '[]');
        setProjects(updatedProjects);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {language === 'zh' ? '作品集' : 'Portfolio'}
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleOpenDialog(project)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={project.imageUrl || '/images/default-project.jpg'}
                  alt={project.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {project.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedProject && (
          <>
            <DialogTitle>{selectedProject.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedProject.imageUrl || '/images/default-project.jpg'}
                  alt={selectedProject.name}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                {language === 'zh' ? '技术栈' : 'Technologies'}
              </Typography>
              <Typography paragraph>
                {selectedProject.technologies}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {language === 'zh' ? '项目描述' : 'Project Description'}
              </Typography>
              <Typography paragraph>
                {selectedProject.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>{language === 'zh' ? '关闭' : 'Close'}</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Portfolio;