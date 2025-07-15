// src/pages/StatsPage.jsx
import { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Container, TextField, Typography, Paper
} from '@mui/material';

export default function StatsPage() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/stats/${code}`);
      setStats(res.data);
    } catch (err) {
      setStats(null);
      alert('Error fetching stats: ' + err.response?.data?.message);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Short URL Stats</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Shortcode" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button variant="contained" onClick={fetchStats}>Get Stats</Button>
      </Box>
      {stats && (
        <Paper sx={{ p: 2 }}>
          <Typography><strong>Original URL:</strong> {stats.originalUrl}</Typography>
          <Typography><strong>Short URL:</strong> {stats.shortUrl}</Typography>
          <Typography><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</Typography>
          <Typography><strong>Expires At:</strong> {new Date(stats.expiresAt).toLocaleString()}</Typography>
          <Typography><strong>Clicks:</strong> {stats.clicks}</Typography>
        </Paper>
      )}
    </Container>
  );
}
