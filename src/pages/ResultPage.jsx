import {
  Container, Typography, Box, Button, Divider, Paper, List, ListItem, ListItemIcon, ListItemText,
  Accordion, AccordionSummary, AccordionDetails, Chip, Fade, Zoom, LinearProgress, Grid, IconButton,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import ShareIcon from '@mui/icons-material/Share'
import ReplayIcon from '@mui/icons-material/Replay'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import StarIcon from '@mui/icons-material/Star'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const foodData = location.state?.foodData
  const apiDebugInfo = location.state?.apiDebugInfo

  if (!foodData) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>
          暂无识别结果
        </Typography>
        <Button
          component={Link}
          to="/recognize"
          variant="contained"
          sx={{ mt: 3, borderRadius: 10, px: 4, py: 1.5 }}
        >
          去识别食物
        </Button>
      </Container>
    )
  }

  const getGoalAdvice = (goal) => {
    switch (goal) {
      case '减脂':
        return {
          advice: '建议控制总热量摄入，搭配运动消耗卡路里',
          tips: ['增加蛋白质摄入比例', '减少高脂肪食物', '配合有氧运动'],
          color: '#FF6B35',
          gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
          emoji: '🔥',
        }
      case '增肌':
        return {
          advice: '保证充足蛋白质和碳水化合物摄入',
          tips: ['训练后及时补充蛋白质', '适当增加碳水摄入', '保证充足睡眠'],
          color: '#2196F3',
          gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
          emoji: '💪',
        }
      case '控糖':
        return {
          advice: '严格控制碳水化合物摄入，选择低GI食物',
          tips: ['避免精制糖和淀粉', '选择全谷物食品', '多吃绿叶蔬菜'],
          color: '#4CAF50',
          gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
          emoji: '🍃',
        }
      default:
        return {
          advice: '保持均衡饮食，适量运动',
          tips: ['规律饮食', '多样化食物选择', '适量运动'],
          color: '#2196F3',
          gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
          emoji: '✅',
        }
    }
  }

  const goalInfo = getGoalAdvice(foodData.goal)
  const caloriePercent = Math.min((foodData.calories / 2000) * 100, 100)
  const getRating = (cal) => {
    if (cal <= 150) return { stars: 5, label: '低热量，很棒！', icon: <EmojiEmotionsIcon color="success" /> }
    if (cal <= 300) return { stars: 4, label: '中等热量，可以接受', icon: <SentimentSatisfiedIcon color="primary" /> }
    return { stars: 3, label: '偏高热量，建议适量', icon: <SentimentDissatisfiedIcon color="warning" /> }
  }
  const rating = getRating(foodData.calories)

  return (
    <Container maxWidth="md" sx={{ pb: { xs: 10, md: 4 } }}>
      {/* Success Header */}
      <Fade in timeout={600}>
        <Box sx={{ textAlign: 'center', mb: 4, mt: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: goalInfo.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: `0 8px 32px ${goalInfo.color}50`,
              animation: 'bounceIn 0.6s ease-out',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            识别完成！
          </Typography>
          <Chip
            label={`识别来源: ${foodData.source || '未知'}`}
            size="small"
            sx={{ fontWeight: 'bold', borderRadius: 10 }}
            color={foodData.source === '菜品识别' ? 'primary' : foodData.source === '果蔬识别' ? 'success' : 'default'}
          />
        </Box>
      </Fade>

      {/* Food Card - Main Result */}
      <Zoom in timeout={800}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            border: `2px solid ${goalInfo.color}30`,
            boxShadow: `0 8px 40px ${goalInfo.color}20`,
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: goalInfo.gradient,
            },
          }}
        >
          {/* Food Name & Confidence */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h4" component="h2" fontWeight="bold">
              {foodData.foodName || '未知食物'}
            </Typography>
            {foodData.confidence && (
              <Chip
                label={`置信度 ${(foodData.confidence * 100).toFixed(1)}%`}
                color={foodData.confidence > 0.8 ? 'success' : foodData.confidence > 0.5 ? 'primary' : 'warning'}
                size="small"
                sx={{ fontWeight: 'bold', borderRadius: 10 }}
              />
            )}
          </Box>

          {/* Calorie Display - Hero Section */}
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              px: 2,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${goalInfo.color}10 0%, ${goalInfo.color}25 100%)`,
              mb: 3,
            }}
          >
            <Typography variant="h1" fontWeight="bold" sx={{ color: goalInfo.color, fontSize: { xs: '3.5rem', md: '4.5rem' } }}>
              {foodData.calories || 0}
            </Typography>
            <Typography variant="h5" color="text.secondary" fontWeight="medium">
              kcal
            </Typography>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
              {rating.icon}
              <Typography variant="body2" color="text.secondary">
                {rating.label}
              </Typography>
            </Box>
          </Box>

          {/* Nutrition Grid */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE0D5 100%)',
                  border: '1px solid rgba(255,107,53,0.2)',
                }}
              >
                <LocalFireDepartmentIcon sx={{ fontSize: 32, color: '#FF6B35', mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" color="#FF6B35">{foodData.protein || 0}g</Typography>
                <Typography variant="caption" color="text.secondary">蛋白质</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  border: '1px solid rgba(33,150,243,0.2)',
                }}
              >
                <FitnessCenterIcon sx={{ fontSize: 32, color: '#2196F3', mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" color="#2196F3">{foodData.fat || 0}g</Typography>
                <Typography variant="caption" color="text.secondary">脂肪</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                  border: '1px solid rgba(76,175,80,0.2)',
                }}
              >
                <MonitorWeightIcon sx={{ fontSize: 32, color: '#4CAF50', mb: 0.5 }} />
                <Typography variant="h6" fontWeight="bold" color="#4CAF50">{foodData.carbs || 0}g</Typography>
                <Typography variant="caption" color="text.secondary">碳水</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Weight Estimate */}
          {foodData.weight && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Chip
                icon={<MonitorWeightIcon />}
                label={`估算重量: ${foodData.weight}g`}
                variant="outlined"
                sx={{ borderRadius: 10, fontWeight: 'bold' }}
              />
            </Box>
          )}
        </Paper>
      </Zoom>

      {/* Personalized Advice */}
      <Fade in timeout={1000}>
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            borderLeft: `4px solid ${goalInfo.color}`,
            background: `linear-gradient(135deg, ${goalInfo.color}08 0%, ${goalInfo.color}15 100%)`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmojiEventsIcon sx={{ color: goalInfo.color }} />
            <Typography variant="h6" fontWeight="bold">
              个性化建议 ({foodData.goal})
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
            {goalInfo.advice}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            具体建议：
          </Typography>
          <List sx={{ p: 0 }}>
            {goalInfo.tips.map((tip, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <StarIcon fontSize="small" sx={{ color: goalInfo.color }} />
                </ListItemIcon>
                <ListItemText
                  primary={tip}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Fade>

      {/* Calorie Progress vs Daily Goal */}
      <Fade in timeout={1200}>
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <LocalFireDepartmentIcon sx={{ mr: 1, verticalAlign: 'middle', color: goalInfo.color }} />
            今日热量进度
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  height: 12,
                  bgcolor: 'grey.200',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${caloriePercent}%`,
                    height: '100%',
                    background: goalInfo.gradient,
                    borderRadius: 6,
                    transition: 'width 1s ease-out',
                    boxShadow: `0 0 16px ${goalInfo.color}60`,
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 60, textAlign: 'right' }}>
              {Math.round(caloriePercent)}%
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            当前食物 {foodData.calories} kcal / 每日目标 2000 kcal
          </Typography>
        </Paper>
      </Fade>

      {/* API Debug Info */}
      {apiDebugInfo && (
        <Accordion sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              🔧 API 原始响应（调试用）
              {apiDebugInfo.dish?.error_code && (
                <Chip label={`菜品识别错误: ${apiDebugInfo.dish.error_code}`} color="error" size="small" sx={{ ml: 1 }} />
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom color="primary">
              菜品识别响应：
            </Typography>
            <Paper
              component="pre"
              sx={{
                fontSize: '0.75rem',
                bgcolor: '#1E1E1E',
                color: '#E0E0E0',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 300,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                mb: 2,
              }}
            >
              {JSON.stringify(apiDebugInfo.dish || {}, null, 2)}
            </Paper>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              果蔬识别响应：
            </Typography>
            <Paper
              component="pre"
              sx={{
                fontSize: '0.75rem',
                bgcolor: '#1E1E1E',
                color: '#E0E0E0',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 300,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {JSON.stringify(apiDebugInfo.ingredient || {}, null, 2)}
            </Paper>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
        <Button
          component={Link}
          to="/recognize"
          variant="contained"
          size="large"
          startIcon={<ReplayIcon />}
          sx={{
            bgcolor: goalInfo.color,
            px: 4,
            py: 1.5,
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: `0 8px 32px ${goalInfo.color}50`,
            '&:hover': {
              bgcolor: goalInfo.color,
              transform: 'translateY(-3px)',
              boxShadow: `0 12px 40px ${goalInfo.color}70`,
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          继续识别
        </Button>
        <Button
          component={Link}
          to="/history"
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 10,
            fontSize: '1rem',
            fontWeight: 'bold',
            borderColor: goalInfo.color,
            color: goalInfo.color,
            '&:hover': {
              borderColor: goalInfo.color,
              bgcolor: `${goalInfo.color}10`,
              transform: 'translateY(-3px)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          查看历史
        </Button>
        <IconButton
          sx={{
            bgcolor: 'grey.100',
            borderRadius: 10,
            '&:hover': { bgcolor: 'grey.200', transform: 'translateY(-3px)' },
            transition: 'all 0.3s',
          }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${foodData.foodName} - 热量识别结果`,
                text: `${foodData.foodName} 的热量为 ${foodData.calories} kcal`,
                url: window.location.href,
              })
            } else {
              alert('分享功能需要在移动设备上使用')
            }
          }}
        >
          <ShareIcon />
        </IconButton>
      </Box>
    </Container>
  )
}

export default ResultPage
