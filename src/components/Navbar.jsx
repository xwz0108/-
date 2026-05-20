import { useMediaQuery, useTheme, Box, Paper, BottomNavigation, BottomNavigationAction, AppBar, Toolbar, Typography, IconButton, Tooltip, Badge, Button } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import HistoryIcon from '@mui/icons-material/History'
import PersonIcon from '@mui/icons-material/Person'
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import { useState, useEffect } from 'react'

function Navbar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  )

  const navItems = [
    { label: '首页', path: '/', icon: <HomeIcon /> },
    { label: '介绍', path: '/about', icon: <InfoIcon /> },
    { label: '识别', path: '/recognize', icon: <CameraAltIcon />, primary: true },
    { label: '历史', path: '/history', icon: <HistoryIcon /> },
    { label: '我的', path: '/profile', icon: <PersonIcon /> },
  ]

  const currentTab = navItems.findIndex(item => {
    if (item.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.path)
  })

  // Desktop Top Nav
  if (!isMobile) {
    return (
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
          boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)',
        }}
      >
        <Toolbar sx={{ py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
            <EmojiFoodBeverageIcon sx={{ fontSize: 32, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '0.5px',
              }}
            >
              热量识别
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <Tooltip title={item.label} key={item.path}>
                <Button
                  component={Link}
                  to={item.path}
                  sx={{
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    background: location.pathname === item.path
                      ? 'rgba(255,255,255,0.25)'
                      : 'transparent',
                    backdropFilter: location.pathname === item.path ? 'blur(10px)' : 'none',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    mx: 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {item.icon}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>{item.label}</Typography>
                  </Box>
                </Button>
              </Tooltip>
            ))}

            <IconButton
              onClick={() => {
                const newMode = !darkMode
                setDarkMode(newMode)
                localStorage.setItem('darkMode', String(newMode))
              }}
              sx={{
                color: 'white',
                ml: 1,
                '&:hover': { background: 'rgba(255,255,255,0.15)' },
              }}
            >
              <Brightness4Icon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    )
  }

  // Mobile Bottom Nav
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid rgba(255,107,53,0.2)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(255,255,255,0.9)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={currentTab === -1 ? 0 : currentTab}
        sx={{
          background: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: '#FF6B35',
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            component={Link}
            to={item.path}
            label={item.label}
            icon={
              item.primary ? (
                <Badge
                  overlap="circular"
                  badgeContent=""
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(135deg, #FF6B35 0%, #FF4081 100%)',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(255, 107, 53, 0.4)',
                      transform: 'translateY(-8px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.1)',
                        boxShadow: '0 8px 24px rgba(255, 107, 53, 0.6)',
                      },
                    }}
                  >
                    {item.icon}
                  </Box>
                </Badge>
              ) : (
                item.icon
              )
            }
            sx={{
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                fontWeight: item.primary ? 'bold' : 'normal',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

export default Navbar
