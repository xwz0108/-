import {
  Container, Typography, Box, Paper, Button, Fade, Zoom, IconButton,
  Alert, Snackbar, Divider, Chip, Tooltip, Grid,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HistoryIcon from '@mui/icons-material/History'
import DeleteIcon from '@mui/icons-material/Delete'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import FilterListIcon from '@mui/icons-material/FilterList'
import TodayIcon from '@mui/icons-material/Today'
import DateRangeIcon from '@mui/icons-material/DateRange'

function HistoryPage() {
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all') // 'all' | 'today' | 'week'
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('foodHistory') || '[]')
    // 按时间倒序
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    setHistory(data)
  }, [])

  const handleClear = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      localStorage.setItem('foodHistory', '[]')
      setHistory([])
      setShowDeleteSuccess(true)
    }
  }

  const handleDelete = (id) => {
    const newHistory = history.filter(item => item.id !== id)
    localStorage.setItem('foodHistory', JSON.stringify(newHistory))
    setHistory(newHistory)
  }

  // 筛选
  const filteredHistory = history.filter(item => {
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0]
      return item.timestamp.startsWith(today)
    }
    if (filter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(item.timestamp) >= weekAgo
    }
    return true
  })

  // 统计数据
  const todayCalories = history
    .filter(item => item.timestamp.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum, item) => sum + (item.calories || 0), 0)

  const avgCalorie = history.length > 0
    ? Math.round(history.reduce((sum, item) => sum + (item.calories || 0), 0) / history.length)
    : 0

  const getCalorieRating = (cal) => {
    if (cal <= 150) return { icon: <SentimentSatisfiedIcon sx={{ color: '#4CAF50' }} />, label: '低热量', color: '#4CAF50' }
    if (cal <= 300) return { icon: <SentimentSatisfiedIcon sx={{ color: '#FF9800' }} />, label: '中等', color: '#FF9800' }
    return { icon: <SentimentDissatisfiedIcon sx={{ color: '#F44336' }} />, label: '偏高', color: '#F44336' }
  }

  return (
    <Container maxWidth="md" sx={{ pb: { xs: 10, md: 4 } }}>
      {/* Header */}
      <Fade in timeout={600}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: { xs: 2, md: 4 }, gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 32px rgba(33,150,243,0.4)',
            }}
          >
            <HistoryIcon />
          </Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            历史记录
          </Typography>
        </Box>
      </Fade>

      {/* Stats Cards */}
      {history.length > 0 && (
        <Fade in timeout={800}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE0D5 100%)',
                  border: '1px solid rgba(255,107,53,0.2)',
                }}
              >
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#FF6B35' }}>
                  {history.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">总记录</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  border: '1px solid rgba(33,150,243,0.2)',
                }}
              >
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#2196F3' }}>
                  {todayCalories}
                </Typography>
                <Typography variant="caption" color="text.secondary">今日 kcal</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                  border: '1px solid rgba(76,175,80,0.2)',
                }}
              >
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                  {avgCalorie}
                </Typography>
                <Typography variant="caption" color="text.secondary">平均 kcal</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #FFF9C4 0%, #FFF176 100%)',
                  border: '1px solid rgba(255,193,7,0.2)',
                }}
              >
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#FF9800' }}>
                  {history.filter(item => item.timestamp.startsWith(new Date().toISOString().split('T')[0])).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">今日次数</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* Filter Tabs */}
      {history.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<FilterListIcon />}
            label="全部"
            onClick={() => setFilter('all')}
            color={filter === 'all' ? 'primary' : 'default'}
            sx={{ borderRadius: 10, fontWeight: 'bold' }}
          />
          <Chip
            icon={<TodayIcon />}
            label="今天"
            onClick={() => setFilter('today')}
            color={filter === 'today' ? 'primary' : 'default'}
            sx={{ borderRadius: 10 }}
          />
          <Chip
            icon={<DateRangeIcon />}
            label="近7天"
            onClick={() => setFilter('week')}
            color={filter === 'week' ? 'primary' : 'default'}
            sx={{ borderRadius: 10 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="清空所有记录">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleClear}
              sx={{ borderRadius: 10, borderColor: '#F44336', color: '#F44336' }}
            >
              清空
            </Button>
          </Tooltip>
        </Box>
      )}

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <Box>
          {filteredHistory.map((item, index) => {
            const rating = getCalorieRating(item.calories)
            return (
              <Zoom in timeout={400 + index * 100} key={item.id}>
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: `0 8px 32px ${rating.color}30`,
                      borderColor: rating.color,
                    },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 4,
                      height: '100%',
                      background: rating.color,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 1 }}>
                    {/* Calorie Badge */}
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: `${rating.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {rating.icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {item.foodName || '未知食物'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${item.calories || 0} kcal`}
                          size="small"
                          sx={{
                            bgcolor: `${rating.color}15`,
                            color: rating.color,
                            fontWeight: 'bold',
                            borderRadius: 5,
                          }}
                        />
                        {item.source && (
                          <Chip
                            label={item.source}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 5, fontSize: '0.7rem' }}
                          />
                        )}
                        {item.confidence && (
                          <Chip
                            label={`${(item.confidence * 100).toFixed(0)}%`}
                            size="small"
                            sx={{ borderRadius: 5, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Time & Delete */}
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(item.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item.id)}
                        sx={{
                          color: 'text.secondary',
                          mt: 0.5,
                          '&:hover': { color: '#F44336', bgcolor: 'rgba(244,67,54,0.1)' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Zoom>
            )
          })}
        </Box>
      ) : (
        /* Empty State */
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <HistoryIcon sx={{ fontSize: 60, color: '#2196F3', opacity: 0.7 }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {filter === 'all' ? '还没有识别记录' : '该时间段暂无记录'}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              快去拍一张食物照片，让 AI 帮你识别热量吧！
            </Typography>
            <Button
              component={Link}
              to="/recognize"
              variant="contained"
              size="large"
              startIcon={<LocalFireDepartmentIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
                boxShadow: '0 8px 32px rgba(255,107,53,0.4)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(255,107,53,0.6)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              去识别食物
            </Button>
          </Box>
        </Fade>
      )}

      {/* Delete Success Snackbar */}
      <Snackbar
        open={showDeleteSuccess}
        autoHideDuration={3000}
        onClose={() => setShowDeleteSuccess(false)}
      >
        <Alert onClose={() => setShowDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
          操作成功！
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default HistoryPage
