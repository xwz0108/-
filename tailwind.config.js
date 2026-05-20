/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Vibrant Orange
        primary: {
          light: '#FFF5F0',
          DEFAULT: '#FF6B35',
          dark: '#E55A2B',
          50:  '#FFF5F0',
          100: '#FFE0D5',
          200: '#FFB8A0',
          300: '#FF8F6B',
          400: '#FF6B35',
          500: '#FF5500',
          600: '#E55A2B',
          700: '#CC4A20',
          800: '#B33A15',
          900: '#8A2D10',
        },
        // Secondary - Electric Blue
        secondary: {
          light: '#E3F2FD',
          DEFAULT: '#2196F3',
          dark: '#1976D2',
        },
        // Accent - Hot Pink
        accent: {
          light: '#FCE4EC',
          DEFAULT: '#FF4081',
          dark: '#F50057',
        },
        // Success - Lime Green
        success: {
          light: '#F1F8E9',
          DEFAULT: '#8BC34A',
          dark: '#689F38',
        },
        // Warm Gradient colors
        warm: {
          DEFAULT: '#FF6B35',
          gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 50%, #FFB74D 100%)',
        },
        // Cool Gradient colors
        cool: {
          DEFAULT: '#2196F3',
          gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 50%, #81D4FA 100%)',
        },
        // Glass effect
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
        // Surface
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F5F7FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        display: ['Poppins', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(255, 107, 53, 0.15)',
        'glass-lg': '0 16px 48px rgba(255, 107, 53, 0.2)',
        glow: '0 0 20px rgba(255, 107, 53, 0.4)',
        'glow-blue': '0 0 20px rgba(33, 150, 243, 0.4)',
        'glow-pink': '0 0 20px rgba(255, 64, 129, 0.4)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 50%, #FFB74D 100%)',
        'gradient-cool': 'linear-gradient(135deg, #2196F3 0%, #64B5F6 50%, #81D4FA 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FF6B35 0%, #FF4081 50%, #FFB74D 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #2196F3 0%, #00BCD4 50%, #4CAF50 100%)',
        'gradient-rainbow': 'linear-gradient(135deg, #FF6B35 0%, #FF4081 25%, #2196F3 50%, #4CAF50 75%, #FFB74D 100%)',
        'glass': 'blur(10px)',
      },
      backdropBlur: {
        sm: '4px',
        DEFAULT: '10px',
        lg: '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
