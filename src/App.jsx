
import { useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    try {
      const res = await fetch(`${API_URL}/api/shorten/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl })
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

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} className="shortener-form">
        <input
          type="url"
          placeholder="Enter a long URL"
          value={longUrl}
          onChange={e => setLongUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Shortening...' : 'Shorten'}</button>
      </form>
      {shortUrl && (
        <div className="result">
          <span>Short URL: </span>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
