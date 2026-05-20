import { Card, CardContent, Typography, Box, Chip } from '@mui/material'

function FoodCard({ food }) {
  if (!food) return null

  const getGoalColor = (goal) => {
    switch (goal) {
      case '减脂':
        return 'success'
      case '增肌':
        return 'primary'
      case '控糖':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {food.foodName || '未知食物'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" color="primary" fontWeight="bold">
            {food.calories || 0}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
            kcal
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`蛋白质: ${food.protein || 0}g`} color="primary" variant="outlined" />
          <Chip label={`脂肪: ${food.fat || 0}g`} color="secondary" variant="outlined" />
          <Chip label={`碳水: ${food.carbs || 0}g`} color="warning" variant="outlined" />
        </Box>

        {food.weight && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            估算重量: {food.weight}g
          </Typography>
        )}

        {food.confidence && (
          <Typography variant="body2" color="text.secondary">
            识别置信度: {(food.confidence * 100).toFixed(1)}%
          </Typography>
        )}

        {food.source && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`识别来源: ${food.source}`}
              size="small"
              variant="outlined"
              color={food.source === '菜品识别' ? 'primary' : food.source === '果蔬识别' ? 'success' : 'default'}
            />
          </Box>
        )}

        {food.goal && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`建议: ${food.goal}`}
              color={getGoalColor(food.goal)}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default FoodCard
