import { Container, Typography, Box, Paper, Button, Alert, Snackbar, Divider, TextField, Fade, Zoom } from '@mui/material'
import { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import BarChartIcon from '@mui/icons-material/BarChart'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import SpaIcon from '@mui/icons-material/Spa'

function ProfilePage() {
  const [healthGoal, setHealthGoal] = useState(
    localStorage.getItem('healthGoal') || '减脂'
  )
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(
    localStorage.getItem('dailyCalorieGoal') || '2000'
  )
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    localStorage.setItem('healthGoal', healthGoal)
    localStorage.setItem('dailyCalorieGoal', dailyCalorieGoal)
    setShowSuccess(true)
  }

  const goals = [
    {
      value: '减脂',
      label: '减脂',
      description: '控制热量摄入，配合运动消耗脂肪',
      icon: <LocalFireDepartmentIcon sx={{ fontSize: 36 }} />,
      color: '#FF6B35',
      bgColor: '#FFF5F0',
      borderColor: '#FF6B35',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
    },
    {
      value: '增肌',
      label: '增肌',
      description: '增加蛋白质和碳水化合物摄入',
      icon: <FitnessCenterIcon sx={{ fontSize: 36 }} />,
      color: '#2196F3',
      bgColor: '#E3F2FD',
      borderColor: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
    },
    {
      value: '控糖',
      label: '控糖',
      description: '严格控制碳水化合物和糖分摄入',
      icon: <SpaIcon sx={{ fontSize: 36 }} />,
      color: '#4CAF50',
      bgColor: '#E8F5E9',
      borderColor: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
    },
  ]

  const caloriePresets = [
    { label: '减脂', sub: '1500 kcal', value: '1500', color: '#FF6B35' },
    { label: '均衡', sub: '2000 kcal', value: '2000', color: '#2196F3' },
    { label: '增肌', sub: '2500 kcal', value: '2500', color: '#4CAF50' },
    { label: '高强度训练', sub: '3000 kcal', value: '3000', color: '#FF9800' },
  ]

  const history = JSON.parse(localStorage.getItem('foodHistory') || '[]')
  const today = new Date().toISOString().split('T')[0]
  const todayHistory = history.filter((item) =>
    item.timestamp.startsWith(today)
  )
  const todayCalories = todayHistory.reduce((sum, item) => sum + (item.calories || 0), 0)
  const progress = dailyCalorieGoal
    ? Math.min((todayCalories / parseInt(dailyCalorieGoal)) * 100, 100)
    : 0

  const activeGoal = goals.find(g => g.value === healthGoal)

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          个人中心
        </Typography>
      </Box>

      {/* Today's Stats */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          今日统计
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              今日摄入
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.dark">
              {todayCalories} <Typography component="span" variant="body1">kcal</Typography>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              每日目标
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: activeGoal?.color || 'primary.main' }}>
              {dailyCalorieGoal} <Typography component="span" variant="body1">kcal</Typography>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              完成进度
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  flex: 1,
                  height: 8,
                  bgcolor: 'grey.300',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${progress}%`,
                    height: '100%',
                    bgcolor: progress > 100 ? 'error.main' : (activeGoal?.color || 'primary.main'),
                    borderRadius: 4,
                    transition: 'width 0.5s ease-in-out',
                  }}
                />
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {Math.round(progress)}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Health Goal Setting - Vibrant Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrackChangesIcon sx={{ color: 'primary.main' }} />
          健康目标
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          选择您的健康目标，获得个性化建议
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {goals.map((goal) => {
            const isActive = healthGoal === goal.value
            return (
              <Zoom in={true} key={goal.value}>
                <Paper
                  onClick={() => setHealthGoal(goal.value)}
                  sx={{
                    flex: 1,
                    minWidth: 200,
                    p: 3,
                    borderRadius: 3,
                    cursor: 'pointer',
                    border: isActive ? `3px solid ${goal.borderColor}` : '3px solid transparent',
                    bgcolor: isActive ? goal.bgColor : 'white',
                    boxShadow: isActive
                      ? `0 8px 32px ${goal.color}40`
                      : '0 2px 8px rgba(0,0,0,0.08)',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.04)',
                      boxShadow: `0 12px 40px ${goal.color}50`,
                      bgcolor: goal.bgColor,
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top gradient bar */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: goal.gradient,
                      opacity: isActive ? 1 : 0.3,
                      transition: 'opacity 0.3s',
                    }}
                  />

                  <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: isActive ? goal.gradient : 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: isActive ? 'white' : goal.color,
                        transition: 'all 0.3s',
                        boxShadow: isActive ? `0 4px 16px ${goal.color}60` : 'none',
                      }}
                    >
                      {goal.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: goal.color, mb: 1 }}>
                      {goal.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {goal.description}
                    </Typography>

                    {isActive && (
                      <Fade in>
                        <Box
                          sx={{
                            mt: 2,
                            py: 0.5,
                            px: 2,
                            borderRadius: 10,
                            background: goal.gradient,
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'inline-block',
                          }}
                        >
                          已选择
                        </Box>
                      </Fade>
                    )}
                  </Box>
                </Paper>
              </Zoom>
            )
          })}
        </Box>
      </Box>

      {/* Daily Calorie Goal - Vibrant Pills */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          每日热量目标
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          设置您的每日热量摄入目标
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          {caloriePresets.map((preset) => {
            const isActive = dailyCalorieGoal === preset.value
            return (
              <Button
                key={preset.value}
                onClick={() => setDailyCalorieGoal(preset.value)}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 10,
                  bgcolor: isActive ? preset.color : 'white',
                  color: isActive ? 'white' : 'text.primary',
                  border: `2px solid ${isActive ? preset.color : 'grey.300'}`,
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? `0 4px 16px ${preset.color}60` : 'none',
                  '&:hover': {
                    bgcolor: isActive ? preset.color : `${preset.color}15`,
                    borderColor: preset.color,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${preset.color}40`,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 100,
                }}
              >
                <span>{preset.label}</span>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                  {preset.sub}
                </Typography>
              </Button>
            )
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <TextField
            type="number"
            label="自定义热量"
            value={dailyCalorieGoal}
            onChange={(e) => setDailyCalorieGoal(e.target.value)}
            size="small"
            sx={{ width: 160 }}
            InputProps={{
              endAdornment: <Typography variant="body2" color="text.secondary">kcal</Typography>,
            }}
          />
        </Box>
      </Box>

      {/* Save Button */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          sx={{
            px: 8,
            py: 2,
            borderRadius: 10,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: activeGoal?.gradient || 'primary.main',
            boxShadow: `0 8px 32px ${activeGoal?.color || 'primary.main'}60`,
            '&:hover': {
              background: activeGoal?.gradient || 'primary.dark',
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 40px ${activeGoal?.color || 'primary.main'}80`,
            },
            transition: 'all 0.3s',
          }}
        >
          保存设置
        </Button>
      </Box>

      {/* Simple Statistics */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          使用统计
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {history.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              总识别次数
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {todayHistory.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              今日识别次数
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {history.length > 0
                ? Math.round(
                    history.reduce((sum, item) => sum + (item.calories || 0), 0) /
                      history.length
                  )
                : 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              平均热量 (kcal)
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          设置已保存！
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ProfilePage
