import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, Divider } from '@mui/material';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      if (res.data.success) {
        // Save token in localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role',res.data.user.role);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        // Redirect to home page
        navigate('/');
      } else {
        setError(res.data.msg || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          p: 4,
          bgcolor: 'white',
          borderRadius: 1,
          boxShadow: 3,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" mb={3} textAlign="center">
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <Button
          type="submit"
          

          fullWidth
          sx={{ mt: 3,backgroundColor: '#008F4C', color: 'white' }}
        >
          Login
        </Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" textAlign="center">
            Don't have an account? Contact the administrator.
        </Typography>
      </Box>
    </Box>
  );
}
