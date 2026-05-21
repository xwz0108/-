import { Container, Typography, Box, Paper, Grid, Avatar, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import SpeedIcon from '@mui/icons-material/Speed'
import SecurityIcon from '@mui/icons-material/Security'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'

function AboutPage() {
  const navigate = useNavigate()

  const purposes = [
    {
      icon: <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '智能识别食物热量',
      desc: '利用人工智能技术，通过拍照或上传图片，自动识别食物种类并计算热量，帮助用户快速了解摄入热量。',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: '辅助健康管理',
      desc: '根据用户设定的健康目标（减脂/增肌/控糖），提供个性化的饮食建议，助力科学健康管理。',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: '保护用户隐私',
      desc: '识别记录优先本地存储，减少数据上传，保障用户饮食隐私安全。',
    },
  ]

  const advantages = [
    { icon: <SpeedIcon />, title: 'GLM-4.6V AI 识别', desc: '基于智谱 GLM-4.6V 多模态模型，直接理解图片内容，自动输出食物名称和热量营养' },
    { icon: <CheckCircleIcon />, title: '操作便捷', desc: '支持拖拽上传、点击上传，三步完成识别（上传→识别→查看结果）' },
    { icon: <AnalyticsIcon />, title: '营养数据全面', desc: '不仅提供热量，还展示蛋白质、脂肪、碳水化合物三大营养素' },
    { icon: <PhoneAndroidIcon />, title: '响应式设计', desc: '适配手机、平板、电脑多种设备，随时随地使用' },
    { icon: <SecurityIcon />, title: '隐私保护', desc: '历史记录本地存储，无需注册登录，保护个人饮食隐私' },
    { icon: <LightbulbIcon />, title: '个性化建议', desc: '根据减脂/增肌/控糖目标，提供差异化饮食建议' },
  ]

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 顶部标题 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          项目介绍
        </Typography>
        <Typography variant="h6" color="text.secondary">
          基于人工智能技术的食物热量识别应用
        </Typography>
        <Chip label="AI 驱动 · 健康饮食 · 隐私保护" color="primary" sx={{ mt: 2 }} />
      </Box>

      {/* 项目目的 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 2 }}>
          项目目的
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2 }}>
          随着人们健康意识的提升，越来越多人开始关注日常饮食的热量摄入。然而，传统的食物热量查询方式存在操作繁琐、数据不准确等问题。本项目旨在利用人工智能图像识别技术，打造一款便捷、准确、隐私安全的食物热量识别应用。
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {purposes.map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper sx={{ p: 3, height: '100%', textAlign: 'center', borderRadius: 3 }}>
                <Avatar sx={{ bgcolor: 'grey.100', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 项目优点 */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom sx={{ borderLeft: 4, borderColor: 'success.main', pl: 2 }}>
          项目优点
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mt: 2 }}>
          相比传统食物热量查询方式，本应用具有以下核心优势：
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {advantages.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 1.5, width: 40, height: 40 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 技术亮点 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom sx={{ borderLeft: 4, borderColor: 'warning.main', pl: 2 }}>
          技术亮点
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[
            'GLM-4.6V 多模态 AI 视觉识别',
            'Vite + React 现代化前端技术栈',
            'MUI + Tailwind CSS 双样式方案',
            'localStorage 本地数据持久化',
            'Vercel Edge Function 服务端部署',
            '响应式设计，适配多端设备',
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1.5 }} />
                  <Typography variant="body2">{item}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 操作按钮 */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Chip label="🎯 立即体验" color="primary" sx={{ fontSize: '1rem', p: 2, cursor: 'pointer' }} onClick={() => navigate('/recognize')} />
        <Box sx={{ mt: 2 }}>
          <Chip label="返回首页" variant="outlined" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }} />
        </Box>
      </Box>
    </Container>
  )
}

export default AboutPage
