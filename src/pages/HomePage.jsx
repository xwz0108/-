import { Container, Typography, Grid, Card, CardContent, Button, Box, Chip, Fade, Zoom, Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import SpaIcon from '@mui/icons-material/Spa'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

function HomePage() {
  const features = [
    {
      icon: <CameraAltIcon sx={{ fontSize: 48 }} />,
      title: 'AI 拍照识别',
      description: '拍一下就知道热量，3秒出结果，比翻营养表快100倍',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
      shadowColor: 'rgba(255, 107, 53, 0.4)',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
      title: '精准营养分析',
      description: '蛋白质、脂肪、碳水全都有，数据来自专业营养数据库',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
      shadowColor: 'rgba(33, 150, 243, 0.4)',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      title: '个性化建议',
      description: '减脂/增肌/控糖，不同目标不同方案，科学不盲从',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
      shadowColor: 'rgba(76, 175, 80, 0.4)',
    },
  ]

  const targetUsers = [
    { title: '🔥 减脂人群', description: '智能控卡，吃瘦不饿瘦', color: '#FF6B35' },
    { title: '💪 健身人群', description: '精准补剂，练后吃什么全知道', color: '#2196F3' },
    { title: '🍃 控糖人群', description: '低GI饮食，稳糖又健康', color: '#4CAF50' },
  ]

  const stats = [
    { number: '10万+', label: '用户正在使用' },
    { number: '98%', label: '识别准确率' },
    { number: '3秒', label: '平均识别速度' },
  ]

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section - Gradient Background with Animated Elements */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF4081 30%, #2196F3 70%, #4CAF50 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
          py: { xs: 8, md: 12 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            animation: 'float 6s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            animation: 'float 8s ease-in-out infinite reverse',
          },
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              {/* Floating Icon */}
              <Box sx={{ mb: 3, display: 'inline-block' }}>
                <EmojiFoodBeverageIcon
                  sx={{
                    fontSize: { xs: 60, md: 80 },
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                    animation: 'float 3s ease-in-out infinite',
                  }}
                />
              </Box>

              {/* Badge */}
              <Chip
                label="🚀 AI 驱动 · 实时识别"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  py: 0.5,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  mb: 3,
                }}
              />

              {/* Main Title */}
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                拍一拍
                <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                  就知道吃了多少热量
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.95,
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                AI 图像识别 + 专业营养数据库，让热量管理像拍照一样简单
              </Typography>

              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/recognize"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    color: '#FF6B35',
                    borderRadius: 10,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.95)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  开始识别
                </Button>

                <Button
                  component={Link}
                  to="/about"
                  variant="outlined"
                  size="large"
                  startIcon={<PlayCircleIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderRadius: 10,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  了解更多
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 4, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ textAlign: 'center' }}>
            {stats.map((stat, idx) => (
              <Grid item xs={4} key={idx}>
                <Fade in timeout={1000 + idx * 200}>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF4081 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Core Features */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: 2, bgcolor: '#F5F7FA' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="✨ 核心功能" color="primary" sx={{ mb: 2, fontWeight: 'bold' }} />
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              为什么选择我们？
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              AI 驱动的食物识别，让健康管理变得简单有趣
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Zoom in timeout={800 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 4,
                      borderRadius: 4,
                      border: '1px solid rgba(0,0,0,0.05)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: `0 20px 60px ${feature.shadowColor}`,
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: feature.gradient,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      {/* Icon with Gradient Background */}
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: feature.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          color: 'white',
                          boxShadow: `0 8px 24px ${feature.shadowColor}`,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                          },
                        }}
                      >
                        {feature.icon}
                      </Box>

                      <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Target Users */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="🎯 适合人群" color="secondary" sx={{ mb: 2, fontWeight: 'bold' }} />
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              为谁而生？
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {targetUsers.map((user, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      borderLeft: `4px solid ${user.color}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: `0 8px 32px ${user.color}30`,
                      },
                    }}
                  >
                    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                      {user.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.description}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: 2,
          background: 'linear-gradient(135deg, #FFF5F0 0%, #E3F2FD 100%)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              准备好开始了吗？
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              免费使用，无需注册，立即体验 AI 食物热量识别
            </Typography>
            <Button
              component={Link}
              to="/recognize"
              variant="contained"
              size="large"
              endIcon={<LocalFireDepartmentIcon />}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF4081 100%)',
                borderRadius: 10,
                boxShadow: '0 8px 32px rgba(255, 107, 53, 0.4)',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 12px 40px rgba(255, 107, 53, 0.6)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              立即免费体验
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
