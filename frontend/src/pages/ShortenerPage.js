import { useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Paper, Grid, IconButton, Box, Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ShortenerPage() {
  const [urls, setUrls] = useState([{ originalUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', error: false });

  const handleChange = (i, field, val) => {
    const updated = [...urls];
    updated[i][field] = val;
    setUrls(updated);
  };

  const handleAddRow = () => {
    if (urls.length < 5) {
      setUrls([...urls, { originalUrl: '', validity: '', shortcode: '' }]);
    } else {
      setSnack({ open: true, message: 'Max 5 URLs allowed.', error: true });
    }
  };

  const validateUrl = (url) => {
    try {
      return Boolean(new URL(url));
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    let resArr = [];

    for (const u of urls) {
      if (!u.originalUrl || !validateUrl(u.originalUrl)) {
        setSnack({ open: true, message: 'Invalid URL found.', error: true });
        return;
      }

      const payload = {
        originalUrl: u.originalUrl,
        ...(u.validity && { validity: parseInt(u.validity) }),
        ...(u.shortcode && { shortcode: u.shortcode })
      };

      try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/shorturls`, payload);
        resArr.push({ original: u.originalUrl, short: res.data.shortUrl });
      } catch (err) {
        resArr.push({
          original: u.originalUrl,
          short: 'Error: ' + (err.response?.data?.message || 'Unknown error')
        });
      }
    }

    setResults(resArr);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnack({ open: true, message: 'Copied to clipboard', error: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          🔗 URL Shortener
        </Typography>

        {urls.map((url, i) => (
          <Grid key={i} container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Original URL"
                fullWidth
                required
                value={url.originalUrl}
                onChange={(e) => handleChange(i, 'originalUrl', e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Validity (mins)"
                type="number"
                fullWidth
                value={url.validity}
                onChange={(e) => handleChange(i, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Custom Shortcode"
                fullWidth
                value={url.shortcode}
                onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        ))}

        <Box display="flex" gap={2}>
          <Button onClick={handleAddRow} variant="outlined">+ Add</Button>
          <Button onClick={handleShorten} variant="contained">Shorten</Button>
        </Box>

        {results.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6">📎 Shortened URLs:</Typography>
            {results.map((r, idx) => (
              <Paper key={idx} sx={{ p: 2, mt: 2, bgcolor: '#f1f1f1' }}>
                <Typography><strong>Original:</strong> {r.original}</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  <strong>Short:</strong>&nbsp;
                  <a href={r.short} target="_blank" rel="noopener noreferrer">{r.short}</a>
                  <IconButton onClick={() => copyToClipboard(r.short)} size="small">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
          message={snack.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          ContentProps={{ style: { backgroundColor: snack.error ? '#d32f2f' : '#2e7d32' } }}
        />
      </Paper>
    </Container>
  );
}
