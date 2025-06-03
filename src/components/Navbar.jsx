import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#0C1A3F', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: 1.2,
            color: '#fff',
            userSelect: 'none',
          }}
        >
          E-Bar Store
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {['/', '/cart'].map((path) => {
            const label = path === '/' ? 'Store' : 'Cart';
            return (
              <Button
                key={path}
                component={Link}
                to={path}
                sx={{
                  color: isActive(path) ? '#ffca28' : '#c5cae9',
                  fontWeight: isActive(path) ? '600' : '400',
                  textTransform: 'uppercase',
                  borderBottom: isActive(path) ? '3px solid #ffca28' : '3px solid transparent',
                  borderRadius: 0,
                  fontSize: 16,
                  transition: 'color 0.3s ease, border-bottom-color 0.3s ease',
                  '&:hover': {
                    color: '#ffca28',
                    borderBottomColor: '#ffca28',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
