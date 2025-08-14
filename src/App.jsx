

import { useState } from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);
    try {
      const res = await fetch(`${API_URL}/api/shorten/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: longUrl })
      });
      if (!res.ok) throw new Error('Failed to shorten URL');
      const data = await res.json();
      setShortUrl(`${API_URL}/${data.short_code}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <InsertLinkIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            iOSS URL Shortener
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            Shorten Your Link
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <TextField
              fullWidth
              type="url"
              label="Enter a long URL"
              value={longUrl}
              onChange={e => setLongUrl(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ minWidth: 120, fontWeight: 600 }}
            >
              {loading ? 'Shortening...' : 'Shorten'}
            </Button>
          </form>
          {shortUrl && (
            <Paper elevation={2} sx={{ mt: 4, p: 2, display: 'flex', alignItems: 'center', gap: 2, background: '#e3f2fd' }}>
              <CheckCircleIcon color="success" />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Short URL:
              </Typography>
              <Link href={shortUrl} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontWeight: 700 }}>
                {shortUrl}
              </Link>
              <IconButton onClick={handleCopy} color={copied ? 'success' : 'primary'}>
                <ContentCopyIcon />
              </IconButton>
              {copied && <Typography variant="caption" color="success.main">Copied!</Typography>}
            </Paper>
          )}
          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
        </Paper>
      </Container>
    </>
  );
}

export default App;
